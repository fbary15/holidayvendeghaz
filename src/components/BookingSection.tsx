"use client";

import { useMemo, useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import { CheckIcon } from "./Icons";
import { PRICING, BOOKING_FLOW, formatFt } from "@/lib/site";
import {
  BOOKING_LIMITS,
  formatHuDate,
  fromISODate,
  toISODate,
  type Availability,
  type BookingStatus,
} from "@/lib/booking";
import { quote, validateStay } from "@/lib/pricing";

/*
 * FOGLALÁSI RENDSZER – UI
 *
 * A szerződés III. pontja szerint a foglalási rendszer háttere a Google Naptár.
 * Az elérhetőséget a `GET /api/foglalas` adja (szabad / függőben lévő / foglalt
 * napok), a beküldés pedig a `POST /api/foglalas`-ra megy, amely naptáresemény-
 * ként rögzíti az igényt, és értesítő e-mailt küld a vendégnek és a tulajdonosnak.
 */

const DAY_NAMES = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const MONTHS = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];

type Status = "past" | "free" | "pending" | "booked";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
/** Naptári nap kulcsa – ugyanaz az `YYYY-MM-DD` formátum, amit az API ad vissza. */
const keyOf = toISODate;
function sameDay(a: Date | null, b: Date | null) {
  return !!a && !!b && a.getTime() === b.getTime();
}
function formatHu(d: Date | null) {
  if (!d) return "—";
  return `${d.getFullYear()}. ${MONTHS[d.getMonth()]} ${d.getDate()}.`;
}
/** Monday-first offset (0 = Monday … 6 = Sunday). */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7;
}

export default function BookingSection() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const [view, setView] = useState(() => {
    const t = startOfDay(new Date());
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [pets, setPets] = useState(false);

  // A naptárat csak beépülés után rendereljük, hogy elkerüljük a „today”
  // szerver/kliens eltéréséből adódó hidratálási eltéréseket.
  useEffect(() => {
    setToday(startOfDay(new Date()));
    setMounted(true);
  }, []);

  // Élő elérhetőség a Google Naptárból. Hiba esetén nem blokkoljuk a felületet:
  // minden nap szabadként jelenik meg, a beküldés pedig szerveroldalon úgyis
  // ellenőrzi az ütközést.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/foglalas")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Availability | null) => {
        if (!cancelled && data) setAvailability(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { bookedSet, pendingSet } = useMemo(
    () => ({
      bookedSet: new Set(availability?.booked ?? []),
      pendingSet: new Set(availability?.pending ?? []),
    }),
    [availability]
  );

  function statusOf(d: Date): Status {
    if (d.getTime() < today.getTime()) return "past";
    if (bookedSet.has(keyOf(d))) return "booked";
    if (pendingSet.has(keyOf(d))) return "pending";
    return "free";
  }

  /** Van-e foglalt/függő/múltbeli nap két dátum között (kizárólagosan)? */
  function rangeHasBlocked(from: Date, to: Date) {
    for (let d = addDays(from, 1); d.getTime() < to.getTime(); d = addDays(d, 1)) {
      const s = statusOf(d);
      if (s !== "free") return true;
    }
    return false;
  }

  function handleSelect(d: Date) {
    const s = statusOf(d);
    if (s !== "free") return;
    // A záró napon túl csak távozást lehet választni, érkezést nem.
    if (beyondWindow(d) && !awaitingCheckOut) return;
    setStatus("idle");
    setError(null);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
      return;
    }
    if (d.getTime() <= checkIn.getTime()) {
      setCheckIn(d);
      setCheckOut(null);
      return;
    }
    if (rangeHasBlocked(checkIn, d)) {
      // Az intervallum foglalt napot érintene → új érkezésként indul.
      setCheckIn(d);
      setCheckOut(null);
      return;
    }
    setCheckOut(d);
  }

  function inRange(d: Date) {
    if (!checkIn || !checkOut) return false;
    return d.getTime() > checkIn.getTime() && d.getTime() < checkOut.getTime();
  }

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
      : 0;

  /**
   * Meddig fogadunk ÉRKEZÉST. A korláton túli napok érkezésnek nem
   * választhatók, távozásnak viszont igen – különben a szilveszteri csomag
   * (érkezés 12-31, távozás 01-03) foglalhatatlan lenne.
   */
  const lastCheckInDate = useMemo(
    () => (BOOKING_LIMITS.lastCheckIn ? fromISODate(BOOKING_LIMITS.lastCheckIn) : null),
    []
  );
  /** Épp távozási dátumot várunk? */
  const awaitingCheckOut = checkIn !== null && checkOut === null;

  function beyondWindow(d: Date) {
    return lastCheckInDate !== null && d.getTime() > lastCheckInDate.getTime();
  }

  /** Foglalt + függő napok együtt – a „kimaradt 2 éjszaka” szabályhoz kell. */
  const unavailable = useMemo(
    () => new Set([...bookedSet, ...pendingSet]),
    [bookedSet, pendingSet]
  );

  /** Ütközik-e a választás a foglalási szabályokkal (min. éjszaka, ünnepi csomag)? */
  const stayIssue = useMemo(
    () =>
      checkIn && checkOut ? validateStay(keyOf(checkIn), keyOf(checkOut), unavailable) : null,
    [checkIn, checkOut, unavailable]
  );

  /** Tájékoztató árkalkuláció – csak érvényes választásra. */
  const priceQuote = useMemo(
    () =>
      checkIn && checkOut && !stayIssue
        ? quote(keyOf(checkIn), keyOf(checkOut), pets ? 1 : 0, unavailable)
        : null,
    [checkIn, checkOut, stayIssue, pets, unavailable]
  );

  const canGoPrev =
    view.year > today.getFullYear() ||
    (view.year === today.getFullYear() && view.month > today.getMonth());

  // A záró nap hónapja után még egy hónapot engedünk, hogy az azon átnyúló
  // foglalás távozási napja is elérhető legyen a naptárban.
  const canGoNext =
    lastCheckInDate === null ||
    view.year * 12 + view.month < lastCheckInDate.getFullYear() * 12 + lastCheckInDate.getMonth() + 1;

  function shiftMonth(delta: number) {
    setView((v) => {
      const m = v.month + delta;
      const year = v.year + Math.floor(m / 12);
      const month = ((m % 12) + 12) % 12;
      return { year, month };
    });
  }

  // Naptárrács napjai (Monday-first, vezető üres cellákkal).
  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const lead = mondayIndex(first);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < lead; i++) arr.push(null);
    for (let day = 1; day <= daysInMonth; day++) arr.push(new Date(view.year, view.month, day));
    return arr;
  }, [view]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Kérjük, válasszon érkezési és távozási dátumot a naptárban.");
      setStatus("idle");
      return;
    }
    if (stayIssue) {
      setError(stayIssue.message);
      setStatus("idle");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: keyOf(checkIn),
          checkOut: keyOf(checkOut),
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          guests: Number(data.get("guests") ?? 2),
          pets: pets ? 1 : 0,
          message: String(data.get("message") ?? ""),
          company: String(data.get("company") ?? ""),
        }),
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
        // Az új „függőben” állapot jelenjen meg azonnal a naptárban is.
        fetch("/api/foglalas")
          .then((r) => (r.ok ? r.json() : null))
          .then((d: Availability | null) => d && setAvailability(d))
          .catch(() => {});
        return;
      }

      const body = await res.json().catch(() => null);
      setError(
        body?.error ??
          "A foglalási igényt most nem sikerült elküldeni. Kérjük, próbálja meg később."
      );
      setStatus("error");
      if (res.status === 409) {
        // Időközben elkelt az időszak – frissítjük a naptárat és a választást.
        setCheckIn(null);
        setCheckOut(null);
        fetch("/api/foglalas")
          .then((r) => (r.ok ? r.json() : null))
          .then((d: Availability | null) => d && setAvailability(d))
          .catch(() => {});
      }
    } catch {
      setError("A foglalási igényt most nem sikerült elküldeni. Kérjük, próbálja meg később.");
      setStatus("error");
    }
  }

  return (
    <section id="foglalas" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="absolute inset-0 pine-glow opacity-40 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          center
          kicker="Foglalás"
          title={<>Nézze meg a szabad időpontokat</>}
          subtitle="Válassza ki az érkezés és a távozás napját a naptárban, majd küldje el foglalási igényét. Munkatársunk hamarosan visszaigazolja."
        />

        {/* Árak – lásd PRICING a src/lib/site.ts-ben. */}
        <AnimatedSection>
          <div className="mt-10 mx-auto max-w-4xl glass-card rounded-3xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {PRICING.seasons.map((s) => (
                <div key={s.id} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
                  <p className="text-[11px] uppercase tracking-wider text-pine-400/80 mb-1.5">
                    {s.label}
                  </p>
                  <p className="font-heading text-2xl md:text-3xl font-semibold text-mist">
                    {formatFt(s.pricePerNight)}
                    <span className="text-sm font-normal text-mist/45"> / éj</span>
                  </p>
                  <p className="mt-2 text-xs text-mist/50 leading-relaxed">{s.period}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-mist/60">
              <p>
                <span className="text-mist/85 font-medium">Minimum {PRICING.minNights} éjszaka.</span>{" "}
                Az árak a teljes nyaralóra értendők.
              </p>
              <p>
                <span className="text-mist/85 font-medium">Foglaló:</span> a teljes összeg{" "}
                {PRICING.depositPercent}%-a, amelyről előlegszámlát küldünk.
              </p>
              <p>
                <span className="text-mist/85 font-medium">Háziállat:</span> legfeljebb{" "}
                {PRICING.pets.max}, {formatFt(PRICING.pets.feePerNight)}/éj felár ellenében.
              </p>
              <p>
                <span className="text-mist/85 font-medium">Az ár tartalmazza:</span>{" "}
                {PRICING.includes.join(", ")}.
              </p>
              <p>
                <span className="text-mist/85 font-medium">Nem tartalmazza:</span>{" "}
                {PRICING.excludes.join(", ")}.
              </p>
            </div>

            <ul className="mt-5 space-y-2 border-t border-white/5 pt-5 text-xs text-mist/55 leading-relaxed">
              {PRICING.conditions.map((c) => (
                <li key={c.slice(0, 24)} className="flex gap-2">
                  <span className="text-pine-400/70 shrink-0">•</span>
                  {c}
                </li>
              ))}
              <li className="flex gap-2">
                <span className="text-pine-400/70 shrink-0">•</span>
                Az ünnepnapokra kizárólag csomagban, főszezoni áron lehet foglalni:{" "}
                {PRICING.holidayPackages
                  .map((p) => `${p.label} (${formatHuDate(p.from)} – ${formatHuDate(p.to)})`)
                  .join(" · ")}
                .
              </li>
              <li className="flex gap-2">
                <span className="text-pine-400/70 shrink-0">•</span>
                {PRICING.validityNote}
              </li>
            </ul>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* NAPTÁR */}
          <AnimatedSection>
            <div className="glass-card rounded-3xl p-5 sm:p-7">
              {/* Fejléc */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  disabled={!canGoPrev}
                  aria-label="Előző hónap"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
                </button>
                <p className="font-heading text-lg md:text-xl font-medium text-mist capitalize">
                  {view.year}. {MONTHS[view.month]}
                </p>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  disabled={!canGoNext}
                  aria-label="Következő hónap"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </div>

              {/* Hét napjai */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[11px] font-medium text-mist/35 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Napok */}
              {!mounted ? (
                <div className="h-64 flex items-center justify-center text-mist/30 text-sm">
                  Naptár betöltése…
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((d, i) => {
                    if (!d) return <div key={`e${i}`} />;
                    const s = statusOf(d);
                    const isIn = sameDay(d, checkIn);
                    const isOut = sameDay(d, checkOut);
                    const isEdge = isIn || isOut;
                    const isBetween = inRange(d);
                    // A záró napon túli nap csak távozásnak választható.
                    const zart = beyondWindow(d) && !awaitingCheckOut;
                    const selectable = s === "free" && !zart;

                    let cls =
                      "relative aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ";
                    if (isEdge) {
                      cls += "bg-pine-500 text-coal-950 font-semibold ";
                    } else if (isBetween) {
                      cls += "bg-pine-500/20 text-pine-100 ";
                    } else if (s === "past") {
                      cls += "text-mist/20 cursor-not-allowed ";
                    } else if (s === "booked") {
                      cls += "text-rose-300/80 bg-rose-500/5 cursor-not-allowed line-through ";
                    } else if (s === "pending") {
                      cls += "text-amber-300/80 bg-amber-500/10 cursor-not-allowed ";
                    } else if (zart) {
                      cls += "text-mist/20 cursor-not-allowed ";
                    } else {
                      cls += "text-mist/80 hover:bg-pine-500/15 hover:text-pine-100 cursor-pointer ";
                    }

                    return (
                      <button
                        key={keyOf(d)}
                        type="button"
                        onClick={() => handleSelect(d)}
                        disabled={!selectable}
                        aria-pressed={isEdge}
                        aria-label={`${formatHu(d)} – ${
                          s === "booked"
                            ? "foglalt"
                            : s === "pending"
                              ? "függőben"
                              : s === "past"
                                ? "elmúlt"
                                : zart
                                  ? "jelenleg nem foglalható"
                                  : "szabad"
                        }`}
                        className={cls}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Jelmagyarázat */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mist/50 border-t border-white/5 pt-5">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pine-500" /> Szabad
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" /> Függőben
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/50" /> Foglalt
                </span>
              </div>

              {BOOKING_LIMITS.lastCheckIn && (
                <p className="mt-3 text-xs text-mist/45 leading-relaxed">
                  Jelenleg {formatHuDate(BOOKING_LIMITS.lastCheckIn)} napjáig tudunk
                  foglalást fogadni. A későbbi időpontokra még nem nyitottuk meg a naptárat –
                  köszönjük a megértését! Ha mégis ekkorra tervez,{" "}
                  <a href="#kapcsolat" className="text-pine-300 hover:underline">
                    keressen minket
                  </a>
                  , szívesen segítünk.
                </p>
              )}
            </div>
          </AnimatedSection>

          {/* ŰRLAP */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-3xl p-5 sm:p-7">
              {/* Kiválasztott időszak összegzés */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-mist/40 mb-1">Érkezés</p>
                  <p className="text-sm text-mist font-medium">{formatHu(checkIn)}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-mist/40 mb-1">Távozás</p>
                  <p className="text-sm text-mist font-medium">{formatHu(checkOut)}</p>
                </div>
              </div>
              {nights > 0 && (
                <p className="-mt-3 mb-5 text-xs text-pine-300">
                  {nights} éjszaka kiválasztva
                </p>
              )}

              {/* Foglalási szabály megsértése – a beküldés is tiltva. */}
              {stayIssue && (
                <div
                  role="status"
                  className="-mt-1 mb-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200"
                >
                  {stayIssue.message}
                </div>
              )}

              {/* Tájékoztató árkalkuláció */}
              {priceQuote && (
                <div className="-mt-1 mb-5 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  {priceQuote.holiday && (
                    <p className="mb-2 text-[11px] uppercase tracking-wider text-pine-400/80">
                      {priceQuote.holiday.label} csomag
                    </p>
                  )}
                  <dl className="space-y-1.5 text-xs">
                    {priceQuote.lines.map((l) => (
                      <div key={l.label} className="flex items-baseline justify-between gap-3">
                        <dt className="text-mist/55">
                          {l.label} <span className="text-mist/35">({l.detail})</span>
                        </dt>
                        <dd className="text-mist/80 whitespace-nowrap">{formatFt(l.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-white/5 pt-3">
                    <span className="text-sm font-medium text-mist">Tájékoztató összesen</span>
                    <span className="font-heading text-lg font-semibold text-pine-300 whitespace-nowrap">
                      {formatFt(priceQuote.total)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-mist/45 leading-relaxed">
                    {priceQuote.needsQuote
                      ? "A választott időszak egy részére egyedi ajánlatot adunk – kérjük, küldje el az igényét."
                      : `Az összeg nem tartalmazza ${PRICING.excludes.join(", ")}. A végleges árat visszaigazoláskor erősítjük meg.`}
                  </p>
                </div>
              )}

              {status === "success" ? (
                <div className="rounded-2xl bg-pine-500/10 border border-pine-500/30 p-8 text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pine-500/20 text-pine-300 mb-4">
                    <CheckIcon className="w-7 h-7" />
                  </span>
                  <h3 className="font-heading text-xl text-mist mb-2">Köszönjük a foglalási igényt!</h3>
                  <p className="text-sm text-mist/55">
                    Visszaigazoló e-mailt küldtünk a megadott címre. Hamarosan
                    jelentkezünk a foglalás véglegesítésével.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setCheckIn(null);
                      setCheckOut(null);
                    }}
                    className="mt-6 text-sm font-semibold text-pine-300 hover:text-pine-200 transition-colors"
                  >
                    Új foglalás indítása
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Név" htmlFor="b-name">
                    <input id="b-name" name="name" type="text" required maxLength={BOOKING_LIMITS.name} autoComplete="name" className={inputCls} placeholder="Teljes név" />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="E-mail" htmlFor="b-email">
                      <input id="b-email" name="email" type="email" required maxLength={BOOKING_LIMITS.email} autoComplete="email" className={inputCls} placeholder="pelda@email.hu" />
                    </Field>
                    <Field label="Telefon" htmlFor="b-phone">
                      <input id="b-phone" name="phone" type="tel" maxLength={BOOKING_LIMITS.phone} autoComplete="tel" className={inputCls} placeholder="+36 …" />
                    </Field>
                  </div>
                  <Field label="Vendégek száma" htmlFor="b-guests">
                    <select id="b-guests" name="guests" className={inputCls} defaultValue="2">
                      {Array.from({ length: BOOKING_LIMITS.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n} className="bg-coal-850">
                          {n} fő
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label
                    htmlFor="b-pets"
                    className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4 cursor-pointer"
                  >
                    <input
                      id="b-pets"
                      name="pets"
                      type="checkbox"
                      checked={pets}
                      onChange={(e) => setPets(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-pine-500"
                    />
                    <span className="text-xs text-mist/70 leading-relaxed">
                      Háziállatot hozok (legfeljebb {PRICING.pets.max}) –{" "}
                      {formatFt(PRICING.pets.feePerNight)}/éj felár
                    </span>
                  </label>

                  <Field label="Megjegyzés" htmlFor="b-msg">
                    <textarea id="b-msg" name="message" rows={3} maxLength={BOOKING_LIMITS.message} className={inputCls} placeholder="Írja meg, hány fővel érkeznek, vagy ha van egyéb kérése…" />
                  </Field>

                  {/* Honeypot: képernyőn kívül (nem sr-only, hogy a felolvasó se mondja ki),
                      és nem disabled — a botok a disabled mezőket átugorják. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                    <label htmlFor="b-company">Cég</label>
                    <input type="text" id="b-company" name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  {error && (
                    <p className="rounded-xl border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-200" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending" || stayIssue !== null}
                    className="w-full rounded-full bg-pine-500 px-6 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Küldés…" : "Foglalási igény elküldése"}
                  </button>
                  <p className="text-[11px] text-mist/60 text-center leading-relaxed">
                    A gomb megnyomásával elfogadja az{" "}
                    <a href="/adatkezeles" className="text-pine-300 hover:underline">adatkezelési tájékoztatót</a>.
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* A foglalás menete – hogy a vendég előre lássa, mi következik. */}
        <AnimatedSection delay={0.15}>
          <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="font-heading text-xl md:text-2xl text-mist mb-1">
              Mi történik a beküldés után?
            </h3>
            <p className="text-sm text-mist/50 mb-7">
              A foglalási igény beküldése még nem végleges foglalás – így zajlik a folyamat:
            </p>

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {BOOKING_FLOW.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-pine-500/15 text-pine-300 text-xs font-semibold mb-3">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-mist mb-1.5">{step.title}</p>
                  <p className="text-xs text-mist/55 leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-xs text-mist/45 leading-relaxed border-t border-white/5 pt-5">
              A foglalás az érkezés napját megelőző {BOOKING_FLOW.freeCancelDays}. napig
              díjmentesen lemondható. Ezt követő lemondás esetén a befizetett foglaló a
              szálláshelyet illeti. Részletek az{" "}
              <a href="/aszf" className="text-pine-300 hover:underline">
                ÁSZF-ben
              </a>
              .
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-mist placeholder:text-mist/50 focus:outline-none focus:border-pine-400/60 focus:bg-white/[0.06] transition-colors";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-xs font-medium text-mist/55 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
