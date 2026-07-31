/**
 * Közös „szerződés” a foglalási felület (BookingSection) és az /api/foglalas
 * route között. Kliens- és szerveroldalon egyaránt importálható – ide ne
 * kerüljön szerver-only kód (googleapis, node:crypto stb.).
 */

export const BOOKING_LIMITS = {
  name: 200,
  email: 254,
  phone: 40,
  message: 2000,
  /** Legfeljebb ennyi hónapra előre lehet foglalni. */
  monthsAhead: 12,
  /** Max éjszaka egy igényben – nyilvánvaló elgépelés/visszaélés kiszűrésére. */
  maxNights: 60,
  /** Max vendégszám (3 hálószoba, 6 fő). */
  maxGuests: 6,
} as const;

/**
 * Ennyi óráig tartja a rendszer a függőben lévő igényt. Ezután a nap
 * automatikusan felszabadul (szerződés III.: „a véglegesítés nélkül maradt
 * foglalási igények meghatározott idő után automatikusan felszabadulnak”).
 */
export const HOLD_HOURS = 48;

/** `company` = honeypot mező: ember számára rejtett, a botok kitöltik. */
export type BookingPayload = {
  /** Érkezés, `YYYY-MM-DD`. */
  checkIn: string;
  /** Távozás, `YYYY-MM-DD` – ez a nap már nem foglalt (kizárólagos vég). */
  checkOut: string;
  name: string;
  email: string;
  phone?: string;
  guests: number;
  /** Hozott háziállatok száma (jelenleg 0 vagy 1). */
  pets?: number;
  message?: string;
  company?: string;
};

/** Az /api/foglalas GET válasza: a lefoglalt és a függőben lévő napok. */
export type Availability = {
  /** Véglegesített (vagy a tulajdonos által kézzel felvett) napok. */
  booked: string[];
  /** Visszaigazolásra váró igények napjai. */
  pending: string[];
};

export type BookingStatus = "idle" | "sending" | "success" | "error";

/** `Date` → `YYYY-MM-DD` a HELYI naptár szerint (nem UTC, hogy ne csússzon el). */
export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** `YYYY-MM-DD` → helyi `Date` (éjfél). Érvénytelen bemenetre `null`. */
export function fromISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // Kiszűri a „2026-02-31” típusú, létező formátumú de érvénytelen dátumot.
  return toISODate(d) === s ? d : null;
}

/** A `[from, to)` intervallum napjai ISO stringként (a `to` már nem tartozik bele). */
export function daysBetween(from: string, to: string): string[] {
  const start = fromISODate(from);
  const end = fromISODate(to);
  if (!start || !end) return [];
  const out: string[] = [];
  for (let d = start; d < end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    out.push(toISODate(d));
  }
  return out;
}

const MONTHS_HU = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];

/** `YYYY-MM-DD` → „2026. augusztus 5.” */
export function formatHuDate(iso: string): string {
  const d = fromISODate(iso);
  if (!d) return iso;
  return `${d.getFullYear()}. ${MONTHS_HU[d.getMonth()]} ${d.getDate()}.`;
}

/** Éjszakák száma két ISO dátum között. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = fromISODate(checkIn);
  const b = fromISODate(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}
