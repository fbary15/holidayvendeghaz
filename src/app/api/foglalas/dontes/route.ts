import { getBooking, confirmBooking, rejectBooking, periodText, isCalendarConfigured } from "@/lib/calendar";
import { isDecision, verifyDecision, type Decision } from "@/lib/booking-token";
import { OWNER_EMAIL, sendMail } from "@/lib/mailer";
import { CONTACT } from "@/lib/site";

/**
 * A tulajdonos egykattintásos döntése a foglalási igényről (szerződés III.).
 *
 * A levélben szereplő link GET-tel egy megerősítő oldalt nyit – a tényleges
 * módosítás csak POST-ra történik. Erre azért van szükség, mert a levelezők és
 * a linkellenőrző robotok gyakran előre lekérik a leveleben lévő linkeket:
 * GET-en dönteni azt jelentené, hogy egy szkenner véletlenül jóváhagyhat egy
 * foglalást.
 */

function page(title: string, body: string, tone: "ok" | "warn" | "error" = "ok"): Response {
  const accent = tone === "ok" ? "#6aa84f" : tone === "warn" ? "#d6a13a" : "#c9524d";
  const html = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} – Holiday Vendégház</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; background: #0d0f0e; color: #e7ece9;
    font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .card {
    width: 100%; max-width: 520px; background: #141817; border: 1px solid #ffffff14;
    border-radius: 20px; padding: 32px;
  }
  h1 { margin: 0 0 16px; font-size: 22px; line-height: 1.3; color: ${accent}; }
  dl { margin: 20px 0; display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 15px; }
  dt { color: #e7ece980; }
  dd { margin: 0; }
  p { color: #e7ece9b0; }
  .actions { margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap; }
  button {
    font: inherit; font-weight: 600; cursor: pointer; border: 0; border-radius: 999px;
    padding: 13px 26px; background: ${accent}; color: #0d0f0e;
  }
  button:hover { filter: brightness(1.1); }
  .muted { font-size: 13px; color: #e7ece970; margin-top: 24px; }
</style>
</head>
<body><main class="card">${body}</main></body>
</html>`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

type Parsed =
  | { ok: true; id: string; decision: Decision }
  | { ok: false; response: Response };

function parse(url: URL): Parsed {
  const id = url.searchParams.get("id") ?? "";
  const decision = url.searchParams.get("d") ?? "";
  const token = url.searchParams.get("t") ?? "";

  if (!id || !isDecision(decision)) {
    return { ok: false, response: page("Hibás link", "<h1>Hibás link</h1><p>A megnyitott link hiányos. Kérjük, használja az e-mailben kapott linket.</p>", "error") };
  }
  if (!verifyDecision(id, decision, token)) {
    return { ok: false, response: page("Érvénytelen link", "<h1>Érvénytelen link</h1><p>A link aláírása nem megfelelő. Kérjük, az e-mailben kapott linket nyissa meg.</p>", "error") };
  }
  return { ok: true, id, decision };
}

/* ------------------------------------------------------------------ */
/* GET – megerősítő oldal                                              */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parse(url);
  if (!parsed.ok) return parsed.response;

  if (!isCalendarConfigured()) {
    return page("Nem elérhető", "<h1>A naptár nincs beállítva</h1><p>A foglalási rendszer jelenleg nem elérhető.</p>", "error");
  }

  const booking = await getBooking(parsed.id).catch(() => null);
  if (!booking) {
    return page("Nem található", "<h1>Az igény nem található</h1><p>Elképzelhető, hogy időközben törölték, vagy lejárt és automatikusan felszabadult.</p>", "warn");
  }
  if (booking.status !== "pending") {
    const label = booking.status === "confirmed" ? "már véglegesítve lett" : "már lejárt";
    return page("Már lezárt igény", `<h1>Erről az igényről már döntött</h1><p>A foglalás ${label}. Nincs teendő.</p>`, "warn");
  }

  const isAccept = parsed.decision === "elfogad";
  const body = `
    <h1>${isAccept ? "Foglalás véglegesítése" : "Foglalási igény elutasítása"}</h1>
    <dl>
      <dt>Időszak</dt><dd>${esc(periodText(booking.checkIn, booking.checkOut))}</dd>
      <dt>Név</dt><dd>${esc(booking.name)}</dd>
      <dt>E-mail</dt><dd>${esc(booking.email)}</dd>
      <dt>Telefon</dt><dd>${esc(booking.phone || "—")}</dd>
      <dt>Vendégek</dt><dd>${esc(booking.guests)} fő</dd>
    </dl>
    <p>${
      isAccept
        ? "A megerősítés után a naptárban foglalttá válik, és a vendég automatikus visszaigazoló e-mailt kap."
        : "Az elutasítás után az igény törlődik a naptárból, a napok felszabadulnak, és a vendég értesítést kap."
    }</p>
    <form method="post" class="actions">
      <button type="submit">${isAccept ? "Igen, véglegesítem" : "Igen, elutasítom"}</button>
    </form>
    <p class="muted">Ha most nem dönt, az igény a lejáratig függőben marad.</p>`;
  return page(isAccept ? "Véglegesítés" : "Elutasítás", body, isAccept ? "ok" : "warn");
}

/* ------------------------------------------------------------------ */
/* POST – a döntés végrehajtása                                        */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const url = new URL(request.url);
  const parsed = parse(url);
  if (!parsed.ok) return parsed.response;

  const booking = await getBooking(parsed.id).catch(() => null);
  if (!booking) {
    return page("Nem található", "<h1>Az igény nem található</h1><p>Elképzelhető, hogy időközben törölték, vagy lejárt.</p>", "warn");
  }
  if (booking.status !== "pending") {
    return page("Már lezárt igény", "<h1>Erről az igényről már döntött</h1><p>Nincs teendő.</p>", "warn");
  }

  const accept = parsed.decision === "elfogad";
  const period = periodText(booking.checkIn, booking.checkOut);

  try {
    if (accept) await confirmBooking(booking);
    else await rejectBooking(booking);
  } catch (err) {
    console.error("[api/foglalas/dontes] a naptár módosítása sikertelen:", err);
    return page("Hiba", "<h1>A művelet nem sikerült</h1><p>A naptárat most nem sikerült módosítani. Kérjük, próbálja meg később.</p>", "error");
  }

  if (booking.email) {
    await sendMail(
      {
        to: booking.email,
        subject: accept
          ? `Foglalását visszaigazoltuk – ${period}`
          : `Foglalási igényéről – ${period}`,
        text: accept
          ? [
              `Kedves ${booking.name}!`,
              "",
              "Örömmel értesítjük, hogy foglalását visszaigazoltuk.",
              "",
              `Időszak: ${period}`,
              `Vendégek: ${booking.guests} fő`,
              `Cím: ${CONTACT.postalCode} ${CONTACT.city}, ${CONTACT.street}`,
              "",
              "Ha bármi kérdése van, válaszoljon erre a levélre, vagy keressen minket:",
              `Telefon: ${CONTACT.phone}`,
              "",
              "Várjuk szeretettel!",
              "Holiday Vendégház",
            ].join("\n")
          : [
              `Kedves ${booking.name}!`,
              "",
              "Köszönjük érdeklődését. Sajnos a kért időpontban nem tudjuk fogadni:",
              "",
              `Időszak: ${period}`,
              "",
              "Kérjük, nézze meg a weboldalunkon a szabad időpontokat, vagy keressen minket",
              "közvetlenül – szívesen segítünk másik időpontot találni.",
              "",
              `Telefon: ${CONTACT.phone}`,
              `E-mail: ${CONTACT.email}`,
              "",
              "Üdvözlettel:",
              "Holiday Vendégház",
            ].join("\n"),
        replyTo: OWNER_EMAIL,
      },
      "api/foglalas/dontes"
    );
  }

  return accept
    ? page(
        "Véglegesítve",
        `<h1>A foglalás véglegesítve</h1><p>Az időszak (<strong>${esc(period)}</strong>) foglaltként szerepel a naptárban, és a vendég megkapta a visszaigazolást.</p>`,
        "ok"
      )
    : page(
        "Elutasítva",
        `<h1>Az igényt elutasította</h1><p>Az időszak (<strong>${esc(period)}</strong>) felszabadult a naptárban, és a vendég értesítést kapott.</p>`,
        "warn"
      );
}
