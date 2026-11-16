import { PRICING, formatFt } from "@/lib/site";
import { daysBetween, formatHuRange, fromISODate, nightsBetween } from "@/lib/booking";

/**
 * Árazási és foglalási szabályok (Megbízó: „Árak, foglalás, <év>”, az adatok
 * a `PRICING.years` listában). Kliens- és szerveroldalon egyaránt használjuk,
 * hogy a felületen mutatott szabály és a szerveroldali ellenőrzés ne
 * csúszhasson szét.
 */

type Range = { readonly from: string; readonly to: string };

export type Season = {
  readonly id: string;
  readonly label: string;
  readonly period: string;
  readonly pricePerNight: number;
  readonly ranges: readonly Range[];
};

export type Discount = {
  readonly pricePerNight: number;
  readonly maxGuests: number;
  readonly nights: number;
  readonly checkInWeekday: number;
  readonly days: string;
  readonly period: string;
  readonly ranges: readonly Range[];
};

export type YearPricing = {
  readonly year: number;
  readonly seasons: readonly Season[];
  readonly holidayPricePerNight: number;
  readonly holidayPackages: readonly { readonly label: string; readonly from: string; readonly to: string }[];
  readonly discount: Discount | null;
};

export type HolidayPackage = {
  label: string;
  from: string;
  to: string;
  year: number;
  pricePerNight: number;
};

/** Az évenkénti árlisták, egyszerűsített (nem `as const`) típussal. */
export const PRICING_YEARS: readonly YearPricing[] = PRICING.years;
const YEARS = PRICING_YEARS;

/** A legfrissebb év árlistája – ezt mutatjuk az oldalon árlistaként. */
export const CURRENT_PRICING: YearPricing = YEARS[YEARS.length - 1];

/** Az összes év ünnepi csomagja, a saját évének csomagárával. */
const PACKAGES: readonly HolidayPackage[] = YEARS.flatMap((y) =>
  y.holidayPackages.map((p) => ({ ...p, year: y.year, pricePerNight: y.holidayPricePerNight }))
);

/** Az adott nap (`YYYY-MM-DD`) évének árlistája, ha van. */
export function pricingYear(iso: string): YearPricing | null {
  const year = Number(iso.slice(0, 4));
  return YEARS.find((y) => y.year === year) ?? null;
}

function inRanges(iso: string, ranges: readonly Range[]): boolean {
  const md = iso.slice(5);
  return ranges.some((r) => md >= r.from && md <= r.to);
}

/** Az adott ÉJSZAKA (kezdőnapja) szezonja a saját évének árlistájából. */
export function seasonFor(iso: string): Season | null {
  const y = pricingYear(iso);
  if (!y) return null;
  return y.seasons.find((s) => inRanges(iso, s.ranges)) ?? null;
}

/** Az adott ÉJSZAKÁT (kezdőnapját) érintő ünnepi csomag, ha van. */
export function holidayFor(iso: string): HolidayPackage | null {
  // A csomag `to` napja a távozás napja, azon már nincs éjszaka.
  return PACKAGES.find((p) => iso >= p.from && iso < p.to) ?? null;
}

/** Pontosan illeszkedik-e a foglalás egy ünnepi csomagra? */
export function exactHolidayPackage(checkIn: string, checkOut: string): HolidayPackage | null {
  return PACKAGES.find((p) => p.from === checkIn && p.to === checkOut) ?? null;
}

/**
 * Egy év még foglalható szezonjai és ünnepi csomagjai a megadott naptól.
 * Az évfordulós időszakban a lejáró év maradékát így tudjuk külön jelezni.
 */
export function remainingOf(y: YearPricing, todayIso: string) {
  return {
    seasons: y.seasons.filter((s) => s.ranges.some((r) => `${y.year}-${r.to}` >= todayIso)),
    packages: y.holidayPackages.filter((p) => p.from >= todayIso),
  };
}

/**
 * Jár-e a kedvezményes ár? Az adott évi feltételek mind egyszerre: legfeljebb
 * `maxGuests` fő, érkezés a megadott napon (vasárnap), pontosan `nights`
 * éjszaka, minden éjszaka a kedvezményes tartományokban, egyik sem ünnepi
 * csomag.
 */
export function discountFor(checkIn: string, checkOut: string, guests: number): Discount | null {
  const d = pricingYear(checkIn)?.discount;
  if (!d) return null;
  if (!Number.isInteger(guests) || guests < 1 || guests > d.maxGuests) return null;
  if (nightsBetween(checkIn, checkOut) !== d.nights) return null;
  if (fromISODate(checkIn)?.getDay() !== d.checkInWeekday) return null;
  const year = checkIn.slice(0, 4);
  const ok = daysBetween(checkIn, checkOut).every(
    (night) => night.slice(0, 4) === year && inRanges(night, d.ranges) && holidayFor(night) === null
  );
  return ok ? d : null;
}

export type StayIssue = { code: "minNights" | "holidayPartial" | "range"; message: string };

/** A foglalási szabályok ellenőrzése (minimum éjszakák, ünnepi csomagok). */
export function validateStay(checkIn: string, checkOut: string): StayIssue | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return { code: "range", message: "A távozás dátuma legyen későbbi az érkezésnél." };

  // 1) Ünnepnapoknál a csomagot HIÁNYTALANUL tartalmaznia kell a foglalásnak.
  //    A Megbízó 2026-08-05-i kérése szerint a csomag elé vagy mögé nyúlhat a
  //    tartózkodás, csak megcsonkítani nem lehet.
  const touched = [
    ...new Set(
      daysBetween(checkIn, checkOut)
        .map(holidayFor)
        .filter((p): p is HolidayPackage => p !== null)
    ),
  ];
  const csonka = touched.filter((p) => checkIn > p.from || checkOut < p.to);
  if (csonka.length > 0) {
    const list = csonka.map((p) => `${p.label}: ${formatHuRange(p.from, p.to)}`).join(" · ");
    return {
      code: "holidayPartial",
      message: `A választott időszak ünnepnapot érint, amelyre csak a teljes csomaggal együtt lehet foglalni – ${list}. A csomag elé vagy után nyugodtan hosszabbíthatja a tartózkodást.`,
    };
  }

  // 2) Minimum éjszakák – kivétel nélkül.
  if (nights < PRICING.minNights) {
    return {
      code: "minNights",
      message: `A minimum foglalható időszak ${PRICING.minNights} éjszaka.`,
    };
  }

  return null;
}

export type QuoteLine = { label: string; detail: string; amount: number };
export type Quote = {
  nights: number;
  lines: QuoteLine[];
  total: number;
  /** Van olyan éjszaka, amelyre nincs érvényes árunk (még nem árazott év). */
  needsQuote: boolean;
  holiday: HolidayPackage | null;
};

/**
 * Tájékoztató árkalkuláció a kiválasztott időszakra. Éjszakánként árazunk, a
 * saját évének árlistája szerint: az ünnepi csomag éjszakái csomagáron, a
 * csomag elé/mögé nyúló éjszakák szezonáron. Ha a kedvezményes ár jár, az
 * mind a 4 éjszakára vonatkozik.
 */
export function quote(
  checkIn: string,
  checkOut: string,
  opts: { guests: number; pets?: number }
): Quote | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return null;

  const days = daysBetween(checkIn, checkOut);
  const holiday = exactHolidayPackage(checkIn, checkOut) ?? holidayFor(checkIn);
  const lines: QuoteLine[] = [];
  let needsQuote = false;

  const discount = discountFor(checkIn, checkOut, opts.guests);
  if (discount) {
    lines.push({
      label: `Kedvezményes hétközi ár, max. ${discount.maxGuests} fő`,
      detail: `${nights} éj × ${formatFt(discount.pricePerNight)}`,
      amount: nights * discount.pricePerNight,
    });
  } else {
    // Évfordulón (pl. 2026. dec. → 2027. jan.) ugyanaz a szezon két évben
    // két külön áron szerepel, ezért a sor címkéjébe az év is bekerül.
    const multiYear = new Set(days.map((d) => d.slice(0, 4))).size > 1;
    const csomagok = new Map<string, { pkg: HolidayPackage; nights: number }>();
    const szezonok = new Map<string, { label: string; price: number; nights: number }>();
    for (const d of days) {
      const p = holidayFor(d);
      if (p) {
        const entry = csomagok.get(p.from) ?? { pkg: p, nights: 0 };
        entry.nights += 1;
        csomagok.set(p.from, entry);
        continue;
      }
      const s = seasonFor(d);
      if (!s) {
        needsQuote = true;
        continue;
      }
      const year = d.slice(0, 4);
      const key = `${year}-${s.id}`;
      const entry = szezonok.get(key) ?? {
        label: multiYear ? `${s.label} (${year})` : s.label,
        price: s.pricePerNight,
        nights: 0,
      };
      entry.nights += 1;
      szezonok.set(key, entry);
    }
    for (const { pkg, nights: n } of csomagok.values()) {
      lines.push({
        label: `${pkg.label} csomag`,
        detail: `${n} éj × ${formatFt(pkg.pricePerNight)}`,
        amount: n * pkg.pricePerNight,
      });
    }
    for (const { label, price, nights: n } of szezonok.values()) {
      lines.push({
        label,
        detail: `${n} éj × ${formatFt(price)}`,
        amount: n * price,
      });
    }
  }

  const pets = opts.pets ?? 0;
  if (pets > 0) {
    lines.push({
      label: "Háziállat",
      detail: `${nights} éj × ${formatFt(PRICING.pets.feePerNight)}`,
      amount: nights * PRICING.pets.feePerNight * pets,
    });
  }

  return {
    nights,
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    needsQuote,
    holiday,
  };
}
