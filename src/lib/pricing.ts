import { PRICING, formatFt } from "@/lib/site";
import { daysBetween, formatHuDate, nightsBetween } from "@/lib/booking";

/**
 * Árazási és foglalási szabályok (Megbízó: „Árak, foglalás, 2026”).
 * Kliens- és szerveroldalon egyaránt használjuk, hogy a felületen mutatott
 * szabály és a szerveroldali ellenőrzés ne csúszhasson szét.
 */

export type Season = (typeof PRICING.seasons)[number];
export type HolidayPackage = (typeof PRICING.holidayPackages)[number];

/** `YYYY-MM-DD` → `MM-DD`. */
function monthDay(iso: string): string {
  return iso.slice(5);
}

export function seasonFor(iso: string): Season | null {
  const md = monthDay(iso);
  for (const s of PRICING.seasons) {
    if (s.ranges.some((r) => md >= r.from && md <= r.to)) return s;
  }
  return null;
}

/** Az adott ÉJSZAKÁT (kezdőnapját) érintő ünnepi csomag, ha van. */
export function holidayFor(iso: string): HolidayPackage | null {
  for (const p of PRICING.holidayPackages) {
    // A csomag `to` napja a távozás napja, azon már nincs éjszaka.
    if (iso >= p.from && iso < p.to) return p;
  }
  return null;
}

/** Pontosan illeszkedik-e a foglalás egy ünnepi csomagra? */
export function exactHolidayPackage(checkIn: string, checkOut: string): HolidayPackage | null {
  return (
    PRICING.holidayPackages.find((p) => p.from === checkIn && p.to === checkOut) ?? null
  );
}

export type StayIssue = { code: "minNights" | "holidayPartial" | "range"; message: string };

/**
 * A foglalási szabályok ellenőrzése.
 *
 * @param unavailable A már foglalt / függő napok halmaza. Ez alapján dől el,
 *   hogy egy 2 éjszakás foglalás „kimaradt rés”-nek minősül-e (főszezonban a
 *   Megbízó ezt engedi, magasabb áron), vagy a 3 éjszakás minimum alá esik.
 */
export function validateStay(
  checkIn: string,
  checkOut: string,
  unavailable?: Set<string>
): StayIssue | null {
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
    const list = csonka
      .map((p) => `${p.label}: ${formatHuDate(p.from)} – ${formatHuDate(p.to)}`)
      .join(" · ");
    return {
      code: "holidayPartial",
      message: `A választott időszak ünnepnapot érint, amelyre csak a teljes csomaggal együtt lehet foglalni – ${list}. A csomag elé vagy után nyugodtan hosszabbíthatja a tartózkodást.`,
    };
  }

  // 2) Minimum éjszakák. Egyetlen kivétel: FŐSZEZONBAN a két foglalás közé
  //    beszorult, kimaradt 2 éjszaka – elő- és utószezonban ilyen kivétel nincs.
  if (nights < PRICING.minNights) {
    if (unavailable && isGapFill(checkIn, checkOut, unavailable)) return null;
    return {
      code: "minNights",
      message: `A minimum foglalható időszak ${PRICING.minNights} éjszaka.`,
    };
  }

  return null;
}

/**
 * Érvényes „kimaradt 2 éjszaka” eset-e? Feltételek együtt:
 * pontosan 2 éjszaka, minden éjszaka főszezonban, és pontosan két foglalás
 * közé eső rést tölt ki.
 */
export function isGapFill(checkIn: string, checkOut: string, unavailable: Set<string>): boolean {
  if (nightsBetween(checkIn, checkOut) !== PRICING.gapFill.nights) return false;
  const days = daysBetween(checkIn, checkOut);
  if (!days.every((d) => seasonFor(d)?.id === PRICING.gapFill.seasonId)) return false;
  return fillsGap(checkIn, checkOut, unavailable);
}

/** Pontosan a két foglalás közé eső rést tölti-e ki a választott időszak? */
export function fillsGap(checkIn: string, checkOut: string, unavailable: Set<string>): boolean {
  const days = daysBetween(checkIn, checkOut);
  if (days.length === 0) return false;
  const prev = shiftDay(checkIn, -1);
  // A távozás napja a következő foglalás érkezési napja, ezért az foglalt.
  return unavailable.has(prev) && unavailable.has(checkOut);
}

function shiftDay(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + delta);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export type QuoteLine = { label: string; detail: string; amount: number };
export type Quote = {
  nights: number;
  lines: QuoteLine[];
  total: number;
  /** Van olyan éjszaka, amelyre nincs érvényes árunk (pl. jövő évi ünnep). */
  needsQuote: boolean;
  holiday: HolidayPackage | null;
};

/**
 * Tájékoztató árkalkuláció a kiválasztott időszakra.
 *
 * @param unavailable Ha átadjuk, felismerjük a főszezoni „kimaradt 2 éjszaka”
 *   esetet, amelynek külön (magasabb) éjszakai ára van.
 */
export function quote(
  checkIn: string,
  checkOut: string,
  pets = 0,
  unavailable?: Set<string>
): Quote | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return null;

  const days = daysBetween(checkIn, checkOut);
  const holiday = exactHolidayPackage(checkIn, checkOut) ?? holidayFor(checkIn);
  const lines: QuoteLine[] = [];
  let needsQuote = false;

  if (unavailable && isGapFill(checkIn, checkOut, unavailable)) {
    lines.push({
      label: "Kimaradt 2 éjszaka (főszezon)",
      detail: `${nights} éj × ${formatFt(PRICING.gapFill.pricePerNight)}`,
      amount: nights * PRICING.gapFill.pricePerNight,
    });
  } else {
    // Éjszakánként árazunk: az ünnepi csomag napjai főszezoni áron, a csomag
    // elé/mögé nyúló éjszakák a saját szezonáruk szerint. Így a Megbízó által
    // kért „csomag + hosszabbítás” eset is helyesen jön ki.
    const csomagEjek = new Map<string, number>();
    const bySeason = new Map<string, { season: Season; nights: number }>();
    for (const d of days) {
      const p = holidayFor(d);
      if (p) {
        csomagEjek.set(p.label, (csomagEjek.get(p.label) ?? 0) + 1);
        continue;
      }
      const s = seasonFor(d);
      if (!s) {
        needsQuote = true;
        continue;
      }
      const entry = bySeason.get(s.id) ?? { season: s, nights: 0 };
      entry.nights += 1;
      bySeason.set(s.id, entry);
    }
    for (const [label, n] of csomagEjek) {
      lines.push({
        label: `${label} csomag`,
        detail: `${n} éj × ${formatFt(PRICING.holidayPricePerNight)}`,
        amount: n * PRICING.holidayPricePerNight,
      });
    }
    for (const { season, nights: n } of bySeason.values()) {
      lines.push({
        label: season.label,
        detail: `${n} éj × ${formatFt(season.pricePerNight)}`,
        amount: n * season.pricePerNight,
      });
    }
  }

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
