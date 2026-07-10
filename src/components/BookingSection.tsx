"use client";

import { useMemo, useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import { CheckIcon } from "./Icons";
import { PRICING } from "@/lib/site";

/*
 * FOGLALÁSI RENDSZER – FOUNDATION (UI)
 *
 * A szerződés III. pontja szerint a foglalási rendszer háttere a Google Naptár,
 * és a beküldött igény e-mailes / naptári értesítést vált ki. Ez itt a rendszer
 * felhasználói felületének alapja: interaktív naptár, amely a szabad / függőben
 * lévő / foglalt napokat eltérő színnel jeleníti meg, és egy foglalási űrlap.
 *
 * ⚠️ A tényleges beküldés (API route → Google Calendar + e-mail értesítés) még
 * bekötendő. Jelenleg az elérhetőség példaadat (mock), a beküldés pedig
 * kliensoldali visszaigazolást mutat.
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
function keyOf(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A naptárat csak beépülés után rendereljük, hogy elkerüljük a „today”
  // szerver/kliens eltéréséből adódó hidratálási eltéréseket.
  useEffect(() => {
    setToday(startOfDay(new Date()));
    setMounted(true);
  }, []);

  // Példa elérhetőség (mock) – a mai naphoz képest, hogy mindig „élőnek” tűnjön.
  const { bookedSet, pendingSet } = useMemo(() => {
    const booked = new Set<string>();
    const pending = new Set<string>();
    const mark = (set: Set<string>, from: number, to: number) => {
      for (let i = from; i <= to; i++) set.add(keyOf(addDays(today, i)));
    };
    mark(booked, 4, 6);
    mark(booked, 19, 22);
    mark(booked, 33, 34);
    mark(pending, 11, 12);
    mark(pending, 26, 27);
    return { bookedSet: booked, pendingSet: pending };
  }, [today]);

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
    setSubmitted(false);
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

  const canGoPrev =
    view.year > today.getFullYear() ||
    (view.year === today.getFullYear() && view.month > today.getMonth());

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Kérjük, válasszon érkezési és távozási dátumot a naptárban.");
      setSubmitted(false);
      return;
    }
    // TODO: valós beküldés – POST egy /api/foglalas route-ra, amely a Google
    // Naptárba írja az igényt és e-mailt küld a vendégnek és a tulajdonosnak.
    setError(null);
    setSubmitted(true);
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

        {/* Ár – ⚠️ HELYKITÖLTŐ (lásd PRICING a src/lib/site.ts-ben). */}
        <AnimatedSection>
          <div className="mt-10 mx-auto max-w-2xl glass-card rounded-3xl px-6 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="sm:shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-mist/40 mb-1.5">
                Ár / éjszaka
              </p>
              {PRICING.placeholder || !PRICING.perNight ? (
                <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-300">
                  Ár megadása hamarosan
                </span>
              ) : (
                <p className="font-heading text-3xl md:text-4xl font-semibold text-mist">
                  {PRICING.perNight}
                  {PRICING.deposit && (
                    <span className="block mt-1 text-sm font-normal text-mist/55">
                      Foglaló: {PRICING.deposit}
                    </span>
                  )}
                </p>
              )}
            </div>
            <p className="text-sm text-mist/55 leading-relaxed sm:border-l sm:border-white/10 sm:pl-6">
              {PRICING.note}
            </p>
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
                  aria-label="Következő hónap"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors"
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
                    const selectable = s === "free";

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
                          s === "free" ? "szabad" : s === "booked" ? "foglalt" : s === "pending" ? "függőben" : "elmúlt"
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

              {submitted ? (
                <div className="rounded-2xl bg-pine-500/10 border border-pine-500/30 p-8 text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pine-500/20 text-pine-300 mb-4">
                    <CheckIcon className="w-7 h-7" />
                  </span>
                  <h3 className="font-heading text-xl text-mist mb-2">Köszönjük a foglalási igényt!</h3>
                  <p className="text-sm text-mist/55">
                    Hamarosan felvesszük Önnel a kapcsolatot a megadott
                    elérhetőségen a foglalás visszaigazolása érdekében.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setCheckIn(null);
                      setCheckOut(null);
                    }}
                    className="mt-6 text-sm font-semibold text-pine-300 hover:text-pine-200 transition-colors"
                  >
                    Új foglalás indítása
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Field label="Név" htmlFor="b-name">
                    <input id="b-name" name="name" type="text" required autoComplete="name" className={inputCls} placeholder="Teljes név" />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="E-mail" htmlFor="b-email">
                      <input id="b-email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="pelda@email.hu" />
                    </Field>
                    <Field label="Telefon" htmlFor="b-phone">
                      <input id="b-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} placeholder="+36 …" />
                    </Field>
                  </div>
                  <Field label="Vendégek száma" htmlFor="b-guests">
                    <select id="b-guests" name="guests" className={inputCls} defaultValue="2">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} className="bg-coal-850">
                          {n} fő
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Megjegyzés" htmlFor="b-msg">
                    <textarea id="b-msg" name="message" rows={3} className={inputCls} placeholder="Írja meg, hány fővel érkeznek, vagy ha van egyéb kérése…" />
                  </Field>

                  {error && (
                    <p className="text-sm text-rose-300" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-full bg-pine-500 px-6 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors"
                  >
                    Foglalási igény elküldése
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
