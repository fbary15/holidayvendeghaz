import {
  BOOKING_LIMITS,
  HOLD_HOURS,
  daysBetween,
  formatHuDate,
  fromISODate,
  nightsBetween,
  toISODate,
  type BookingPayload,
} from "@/lib/booking";
import {
  CalendarNotConfigured,
  createPendingBooking,
  getAvailability,
  isCalendarConfigured,
  periodText,
} from "@/lib/calendar";
import { signDecision } from "@/lib/booking-token";
import { OWNER_EMAIL, safeSubjectPart, sendMail } from "@/lib/mailer";
import { quote, validateStay } from "@/lib/pricing";
import { CONTACT, PRICING, formatFt } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort korlátozás példányonként (hidegindításkor nullázódik) – udvariassági
// fék a spam ellen, nem biztonsági határ.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const blocked = recent.length >= MAX_PER_WINDOW;
  if (!blocked) recent.push(now);
  hits.set(ip, recent);
  return blocked;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function today(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** A weboldal címe – az e-mailekbe kerülő linkekhez. */
function baseUrl(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

/* ------------------------------------------------------------------ */
/* GET – szabad / függő / foglalt napok                                */
/* ------------------------------------------------------------------ */

export async function GET() {
  if (!isCalendarConfigured()) {
    // A naptár még nincs bekötve: üres elérhetőséggel válaszolunk, hogy a
    // felület működjön, de jelezzük, hogy nem élő adat.
    return Response.json({ booked: [], pending: [], configured: false });
  }

  const from = today();
  const rolling = new Date(from.getFullYear(), from.getMonth() + BOOKING_LIMITS.monthsAhead, 1);
  // A záró dátumon túl is kérünk pár napot, hogy az utolsó nappal kezdődő
  // foglalás (pl. a szilveszteri csomag) elfoglalt napjai is látszódjanak.
  const hardLimit = BOOKING_LIMITS.lastCheckIn ? fromISODate(BOOKING_LIMITS.lastCheckIn) : null;
  const to =
    hardLimit && hardLimit < rolling
      ? new Date(hardLimit.getFullYear(), hardLimit.getMonth(), hardLimit.getDate() + 14)
      : rolling;

  try {
    const availability = await getAvailability(toISODate(from), toISODate(to));
    return Response.json({
      ...availability,
      configured: true,
      lastCheckIn: BOOKING_LIMITS.lastCheckIn,
    });
  } catch (err) {
    console.error("[api/foglalas] elérhetőség lekérése sikertelen:", err);
    return Response.json(
      { booked: [], pending: [], configured: false, error: "Az elérhetőség jelenleg nem kérdezhető le." },
      { status: 502 }
    );
  }
}

/* ------------------------------------------------------------------ */
/* POST – foglalási igény beküldése                                    */
/* ------------------------------------------------------------------ */

type Validated = { ok: true; value: BookingPayload } | { ok: false; error: string };

function validate(body: Record<string, unknown>): Validated {
  const name = str(body.name);
  if (!name || name.length > BOOKING_LIMITS.name) return { ok: false, error: "Kérjük, adja meg a nevét." };

  const email = str(body.email);
  if (!email || email.length > BOOKING_LIMITS.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Kérjük, adjon meg egy érvényes e-mail címet." };
  }

  const phone = str(body.phone);
  if (phone.length > BOOKING_LIMITS.phone) return { ok: false, error: "A telefonszám túl hosszú." };

  const message = str(body.message);
  if (message.length > BOOKING_LIMITS.message) return { ok: false, error: "A megjegyzés túl hosszú." };

  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > BOOKING_LIMITS.maxGuests) {
    return { ok: false, error: `A vendégek száma 1 és ${BOOKING_LIMITS.maxGuests} között lehet.` };
  }

  const pets = body.pets === undefined ? 0 : Number(body.pets);
  if (!Number.isInteger(pets) || pets < 0 || pets > PRICING.pets.max) {
    return { ok: false, error: `Legfeljebb ${PRICING.pets.max} háziállat hozható.` };
  }

  const checkIn = str(body.checkIn);
  const checkOut = str(body.checkOut);
  const inDate = fromISODate(checkIn);
  const outDate = fromISODate(checkOut);
  if (!inDate || !outDate) return { ok: false, error: "Kérjük, válasszon érkezési és távozási dátumot." };

  if (inDate < today()) return { ok: false, error: "Az érkezés dátuma nem lehet a múltban." };

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return { ok: false, error: "A távozás dátuma legyen későbbi az érkezésnél." };
  if (nights > BOOKING_LIMITS.maxNights) {
    return { ok: false, error: `Legfeljebb ${BOOKING_LIMITS.maxNights} éjszaka foglalható egyszerre.` };
  }

  // Kemény zárónap (ha van): eddig a napig fogadunk ÉRKEZÉST. A távozás
  // átnyúlhat rajta – így a szilveszteri csomag is foglalható marad.
  const hardLimit = BOOKING_LIMITS.lastCheckIn ? fromISODate(BOOKING_LIMITS.lastCheckIn) : null;
  if (hardLimit && inDate > hardLimit) {
    return {
      ok: false,
      error: `Jelenleg ${formatHuDate(BOOKING_LIMITS.lastCheckIn!)} napjáig fogadunk foglalást. Későbbi időpontért kérjük, keressen minket közvetlenül.`,
    };
  }

  const limit = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate());
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + BOOKING_LIMITS.monthsAhead);
  if (limit > maxDate) {
    return { ok: false, error: `Jelenleg legfeljebb ${BOOKING_LIMITS.monthsAhead} hónapra előre lehet foglalni.` };
  }

  return {
    ok: true,
    value: { checkIn, checkOut, name, email, phone, guests, pets, message },
  };
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 20_000) {
    return Response.json({ error: "A kérés túl nagy." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (typeof body !== "object" || body === null) throw new Error("not an object");
  } catch {
    return Response.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  // Kitöltött honeypot → sikert színlelünk, hogy a botok ne tanuljanak belőle.
  if (str(body.company) !== "") return Response.json({ ok: true });

  const result = validate(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  const booking = result.value;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return Response.json(
      { error: "Túl sok foglalási igény érkezett. Kérjük, próbálja meg később." },
      { status: 429 }
    );
  }

  if (!isCalendarConfigured()) {
    console.error("[api/foglalas] a naptár nincs beállítva – az igény NEM rögzült.");
    return Response.json(
      { error: "A foglalási rendszer jelenleg nem elérhető. Kérjük, keressen minket e-mailben." },
      { status: 503 }
    );
  }

  // Ütközés- és szabályellenőrzés közvetlenül a beírás előtt, hogy két egyszerre
  // érkező igény ne foglalhassa le ugyanazt a napot. A szomszédos napokat is
  // lekérjük, mert a „kimaradt 2 éjszaka” szabályhoz tudni kell, hogy az időszak
  // két foglalás közé esik-e.
  // A foglalt napok halmaza az e-mailek árkalkulációjához is kell (a főszezoni
  // „kimaradt 2 éjszaka” felismeréséhez), ezért a blokkon kívül tartjuk.
  let taken = new Set<string>();
  try {
    const shift = (iso: string, delta: number) => {
      const d = fromISODate(iso)!;
      return toISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta));
    };
    const availability = await getAvailability(
      shift(booking.checkIn, -1),
      shift(booking.checkOut, 2)
    );
    taken = new Set([...availability.booked, ...availability.pending]);
    const wanted = daysBetween(booking.checkIn, booking.checkOut);
    if (wanted.some((d) => taken.has(d))) {
      return Response.json(
        { error: "A kiválasztott időszak időközben foglalttá vált. Kérjük, válasszon másik időpontot." },
        { status: 409 }
      );
    }

    // A felületen is ellenőrzött szabályok (min. éjszaka, ünnepi csomag) –
    // szerveroldalon is, mert a kliens megkerülhető.
    const issue = validateStay(booking.checkIn, booking.checkOut, taken);
    if (issue) return Response.json({ error: issue.message }, { status: 400 });
  } catch (err) {
    if (err instanceof CalendarNotConfigured) {
      return Response.json({ error: "A foglalási rendszer jelenleg nem elérhető." }, { status: 503 });
    }
    console.error("[api/foglalas] ütközés-ellenőrzés sikertelen:", err);
    return Response.json({ error: "A foglalás jelenleg nem rögzíthető." }, { status: 502 });
  }

  let eventId: string;
  try {
    eventId = await createPendingBooking(booking);
  } catch (err) {
    console.error("[api/foglalas] naptáresemény létrehozása sikertelen:", err);
    return Response.json({ error: "A foglalás jelenleg nem rögzíthető." }, { status: 502 });
  }

  /* --- Értesítő e-mailek (a foglalás már rögzült, ezért a hibájuk nem buktatja el) --- */

  const period = periodText(booking.checkIn, booking.checkOut);
  const petsText = booking.pets ? `${booking.pets} db (+${formatFt(PRICING.pets.feePerNight)}/éj)` : "nem";

  // Tájékoztató árkalkuláció – ugyanaz, amit a vendég a felületen látott.
  const priceQuote = quote(booking.checkIn, booking.checkOut, booking.pets ?? 0, taken);
  const priceLines = priceQuote
    ? [
        ...priceQuote.lines.map((l) => `  ${l.label} (${l.detail}): ${formatFt(l.amount)}`),
        `  Összesen (tájékoztató): ${formatFt(priceQuote.total)}`,
        `  Nem tartalmazza: ${PRICING.excludes.join(", ")}.`,
      ]
    : ["  —"];

  const base = baseUrl(request);
  const link = (d: "elfogad" | "elutasit") =>
    `${base}/api/foglalas/dontes?id=${encodeURIComponent(eventId)}&d=${d}&t=${signDecision(eventId, d)}`;

  const ownerMail = sendMail(
    {
      subject: `Új foglalási igény – ${safeSubjectPart(booking.name)} (${period})`,
      text: [
        "Új foglalási igény érkezett a weboldalról.",
        "",
        `Időszak: ${period}`,
        `Név: ${booking.name}`,
        `E-mail: ${booking.email}`,
        `Telefon: ${booking.phone || "—"}`,
        `Vendégek: ${booking.guests} fő`,
        `Háziállat: ${petsText}`,
        `Megjegyzés: ${booking.message || "—"}`,
        "",
        "── ÁR (tájékoztató) ──",
        ...priceLines,
        "",
        "── DÖNTÉS ──",
        "",
        `Elfogadás:  ${link("elfogad")}`,
        `Elutasítás: ${link("elutasit")}`,
        "",
        `A link megnyitása után még meg kell erősítenie egy gombbal, tehát véletlenül nem tud dönteni.`,
        `Ha ${HOLD_HOURS} órán belül nem dönt, az igény lejár, és a napok automatikusan felszabadulnak.`,
        "",
        "Az igény addig „Függőben” állapotban szerepel a Foglalások naptárban.",
      ].join("\n"),
      replyTo: booking.email,
    },
    "api/foglalas"
  );

  const guestMail = sendMail(
    {
      to: booking.email,
      subject: `Foglalási igényét megkaptuk – ${CONTACT.addressShort}`,
      text: [
        `Kedves ${booking.name}!`,
        "",
        "Köszönjük foglalási igényét! Az alábbi adatokkal rögzítettük:",
        "",
        `Időszak: ${period}`,
        `Vendégek: ${booking.guests} fő`,
        booking.pets ? `Háziállat: ${booking.pets} db` : "",
        booking.message ? `Megjegyzés: ${booking.message}` : "",
        "",
        "Tájékoztató ár:",
        ...priceLines,
        "",
        `${PRICING.validityNote}`,
        "",
        "Ez még nem végleges visszaigazolás – hamarosan jelentkezünk, és e-mailben",
        "értesítjük, ha a foglalást véglegesítettük.",
        "",
        "Ha bármi kérdése van, válaszoljon erre a levélre, vagy keressen minket:",
        `Telefon: ${CONTACT.phone}`,
        `E-mail: ${CONTACT.email}`,
        "",
        "Üdvözlettel:",
        `Holiday Vendégház – ${CONTACT.addressShort}`,
      ]
        .filter(Boolean)
        .join("\n"),
      replyTo: OWNER_EMAIL,
    },
    "api/foglalas"
  );

  const [ownerOk, guestOk] = await Promise.all([ownerMail, guestMail]);
  if (!ownerOk || !guestOk) {
    console.error("[api/foglalas] értesítő e-mail nem ment ki", { ownerOk, guestOk, eventId });
  }

  return Response.json({ ok: true, period: formatHuDate(booking.checkIn) });
}
