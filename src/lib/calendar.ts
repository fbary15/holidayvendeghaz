import { google, type calendar_v3 } from "googleapis";
import {
  HOLD_HOURS,
  type Availability,
  type BookingPayload,
  daysBetween,
  formatHuDate,
  fromISODate,
  nightsBetween,
  toISODate,
} from "@/lib/booking";

/**
 * Google Naptár réteg a foglalási rendszerhez (szerződés III.).
 *
 * Környezeti változók:
 *   GOOGLE_SERVICE_ACCOUNT_JSON – a service account kulcs TELJES JSON-ja egy sorban
 *   GOOGLE_CALENDAR_ID          – a „Foglalások” naptár azonosítója
 *
 * A naptárat a Megbízónak meg kell osztania a service accounttal
 * „Események módosítása” joggal. Ellenőrzés: `node check-calendar.mjs <kulcs>`.
 */

/** Az általunk létrehozott események állapota (extendedProperties.private). */
type HvStatus = "pending" | "confirmed" | "expired";

export type BookingEvent = {
  id: string;
  status: HvStatus;
  name: string;
  email: string;
  phone: string;
  guests: string;
  checkIn: string;
  checkOut: string;
};

export class CalendarNotConfigured extends Error {
  constructor() {
    super("A Google Naptár nincs beállítva (GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_CALENDAR_ID).");
    this.name = "CalendarNotConfigured";
  }
}

export function calendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new CalendarNotConfigured();
  return id;
}

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

function getClient(): calendar_v3.Calendar {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new CalendarNotConfigured();

  let creds: { client_email?: string; private_key?: string };
  try {
    creds = JSON.parse(raw);
  } catch {
    throw new Error("A GOOGLE_SERVICE_ACCOUNT_JSON nem érvényes JSON.");
  }
  if (!creds.client_email || !creds.private_key) {
    throw new Error("A GOOGLE_SERVICE_ACCOUNT_JSON-ból hiányzik a client_email vagy a private_key.");
  }

  const auth = new google.auth.JWT({
    email: creds.client_email,
    // A Vercel env-ben a sortörés gyakran `\n` szövegként marad – visszaalakítjuk.
    key: creds.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}

function addOneDay(iso: string): string {
  const d = fromISODate(iso);
  if (!d) return iso;
  return toISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
}

/** Egy esemény által lefedett napok. Egész napos eseménynél a vég kizárólagos. */
function eventDays(ev: calendar_v3.Schema$Event): string[] {
  const isAllDay = Boolean(ev.start?.date);
  const start = ev.start?.date ?? ev.start?.dateTime?.slice(0, 10);
  const rawEnd = ev.end?.date ?? ev.end?.dateTime?.slice(0, 10);
  if (!start) return [];
  // Időpontos eseménynél a záró nap még foglalt, ezért +1 nap a kizárólagos véghez.
  const end = rawEnd ? (isAllDay ? rawEnd : addOneDay(rawEnd)) : addOneDay(start);
  return daysBetween(start, end);
}

function statusOf(ev: calendar_v3.Schema$Event): HvStatus | "external" {
  const s = ev.extendedProperties?.private?.hvStatus;
  if (s === "pending" || s === "confirmed" || s === "expired") return s;
  // Amit a tulajdonos kézzel vett fel a naptárba, azt foglaltnak tekintjük.
  return "external";
}

/** Lejárt-e a függőben lévő igény (a létrehozástól számítva)? */
function isExpired(ev: calendar_v3.Schema$Event, now: number): boolean {
  const created = ev.created ? Date.parse(ev.created) : NaN;
  if (Number.isNaN(created)) return false;
  return now - created > HOLD_HOURS * 3_600_000;
}

/**
 * Szabad/függő/foglalt napok a megadott intervallumra.
 * A lejárt, vissza nem igazolt igények automatikusan felszabadulnak.
 */
export async function getAvailability(from: string, to: string): Promise<Availability> {
  const calendar = getClient();
  const res = await calendar.events.list({
    calendarId: calendarId(),
    timeMin: new Date(`${from}T00:00:00Z`).toISOString(),
    timeMax: new Date(`${to}T00:00:00Z`).toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500,
  });

  const now = Date.now();
  const booked = new Set<string>();
  const pending = new Set<string>();
  const expired: calendar_v3.Schema$Event[] = [];

  for (const ev of res.data.items ?? []) {
    // A „szabadként” jelölt események (pl. emlékeztetők) nem foglalnak napot.
    if (ev.transparency === "transparent") continue;

    const status = statusOf(ev);
    if (status === "expired") continue;

    if (status === "pending") {
      if (isExpired(ev, now)) {
        expired.push(ev);
        continue;
      }
      for (const d of eventDays(ev)) pending.add(d);
      continue;
    }
    // "confirmed" és "external" egyaránt foglalt.
    for (const d of eventDays(ev)) booked.add(d);
  }

  // A lejárt igényeket megjelöljük, hogy ne blokkoljanak és látszódjon a sorsuk.
  // Best-effort: ha nem sikerül, az elérhetőség attól még helyes.
  await Promise.allSettled(
    expired.map((ev) =>
      calendar.events.patch({
        calendarId: calendarId(),
        eventId: ev.id!,
        requestBody: {
          summary: `⌛ Lejárt igény – ${ev.extendedProperties?.private?.hvName ?? "ismeretlen"}`,
          transparency: "transparent",
          extendedProperties: { private: { ...ev.extendedProperties?.private, hvStatus: "expired" } },
        },
      })
    )
  );

  // A függő nap ne számítson kétszer, ha közben véglegesítettük.
  for (const d of booked) pending.delete(d);

  return { booked: [...booked].sort(), pending: [...pending].sort() };
}

/** Létrehozza a függőben lévő foglalási igényt. Visszaadja az esemény azonosítóját. */
export async function createPendingBooking(p: BookingPayload): Promise<string> {
  const calendar = getClient();
  const nights = nightsBetween(p.checkIn, p.checkOut);

  const description = [
    `Név: ${p.name}`,
    `E-mail: ${p.email}`,
    `Telefon: ${p.phone || "—"}`,
    `Vendégek: ${p.guests} fő`,
    `Háziállat: ${p.pets ? `${p.pets} db` : "nem"}`,
    `Éjszakák: ${nights}`,
    "",
    `Megjegyzés: ${p.message || "—"}`,
    "",
    "— A weboldal foglalási űrlapjáról érkezett igény.",
  ].join("\n");

  const res = await calendar.events.insert({
    calendarId: calendarId(),
    requestBody: {
      summary: `⏳ Függőben – ${p.name} (${p.guests} fő)`,
      description,
      start: { date: p.checkIn },
      // Egész napos eseménynél a vég kizárólagos: a távozás napja szabad marad.
      end: { date: p.checkOut },
      transparency: "opaque",
      extendedProperties: {
        private: {
          hvStatus: "pending",
          hvName: p.name,
          hvEmail: p.email,
          hvPhone: p.phone ?? "",
          hvGuests: String(p.guests),
        },
      },
    },
  });

  const id = res.data.id;
  if (!id) throw new Error("A naptáresemény létrejött, de nem kaptunk azonosítót.");
  return id;
}

function toBookingEvent(ev: calendar_v3.Schema$Event): BookingEvent | null {
  const priv = ev.extendedProperties?.private ?? {};
  const status = statusOf(ev);
  if (status === "external" || !ev.id) return null;
  return {
    id: ev.id,
    status,
    name: priv.hvName ?? "",
    email: priv.hvEmail ?? "",
    phone: priv.hvPhone ?? "",
    guests: priv.hvGuests ?? "",
    checkIn: ev.start?.date ?? ev.start?.dateTime?.slice(0, 10) ?? "",
    checkOut: ev.end?.date ?? ev.end?.dateTime?.slice(0, 10) ?? "",
  };
}

export async function getBooking(eventId: string): Promise<BookingEvent | null> {
  const calendar = getClient();
  try {
    const res = await calendar.events.get({ calendarId: calendarId(), eventId });
    return toBookingEvent(res.data);
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 404 || code === 410) return null;
    throw err;
  }
}

/** Véglegesíti a foglalást a naptárban. */
export async function confirmBooking(ev: BookingEvent): Promise<void> {
  const calendar = getClient();
  await calendar.events.patch({
    calendarId: calendarId(),
    eventId: ev.id,
    requestBody: {
      summary: `✅ Foglalt – ${ev.name} (${ev.guests} fő)`,
      transparency: "opaque",
      extendedProperties: {
        private: {
          hvStatus: "confirmed",
          hvName: ev.name,
          hvEmail: ev.email,
          hvPhone: ev.phone,
          hvGuests: ev.guests,
        },
      },
    },
  });
}

/** Elutasítja az igényt: az esemény törlődik, a napok felszabadulnak. */
export async function rejectBooking(ev: BookingEvent): Promise<void> {
  const calendar = getClient();
  await calendar.events.delete({ calendarId: calendarId(), eventId: ev.id });
}

/** Emberi olvasásra szánt időszak-leírás, e-mailekhez. */
export function periodText(checkIn: string, checkOut: string): string {
  const nights = nightsBetween(checkIn, checkOut);
  return `${formatHuDate(checkIn)} – ${formatHuDate(checkOut)} (${nights} éjszaka)`;
}
