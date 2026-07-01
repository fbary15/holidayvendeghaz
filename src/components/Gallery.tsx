"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "./PlaceholderImage";
import AnimatedSection from "./AnimatedSection";

/*
 * Galéria (Galéria aloldal – szerződés 1.1 / III. Oldalstruktúra).
 *
 * ⚠️ Egyelőre stílusos helykitöltő csempék. A fotózás a szerződés 1.3. pontja
 * szerint külön megállapodás tárgya; élesítés előtt a Megbízó által biztosított
 * valódi fotókra kell cserélni (a PlaceholderImage helyére next/image kerül).
 */

type Item = { label: string; index: number };

const items: Item[] = [
  { label: "Nappali", index: 0 },
  { label: "Étkező", index: 3 },
  { label: "Konyha", index: 2 },
  { label: "Hálószoba", index: 1 },
  { label: "Második hálószoba", index: 4 },
  { label: "Fürdőszoba", index: 5 },
  { label: "Terasz", index: 2 },
  { label: "Kert", index: 0 },
  { label: "Grillező", index: 3 },
  { label: "Környék", index: 4 },
  { label: "Körös-part", index: 1 },
  { label: "Naplemente", index: 5 },
];

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // Az a csempe, amely megnyitotta a lightboxot – bezáráskor ide tér vissza a fókusz.
  const triggerRef = useRef<HTMLElement | null>(null);

  const isOpen = open !== null;

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    []
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    []
  );

  // Billentyűkezelés + görgeteszár + fókuszcsapda, amíg a lightbox nyitva van.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>("button"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || !dialog.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialog.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    // Görgetés tiltása a lightbox alatt.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  // Nyitáskor a fókuszt a dialógusba visszük, záráskor a nyitó csempére állítjuk vissza.
  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <AnimatedSection key={item.label + i} delay={(i % 3) * 0.06}>
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
              className="group block w-full aspect-[4/3] rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-400"
              aria-label={`${item.label} – nagyítás`}
            >
              <span className="block w-full h-full transition-transform duration-500 group-hover:scale-105">
                <PlaceholderImage index={item.index} label={item.label} />
              </span>
            </button>
          </AnimatedSection>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-coal-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${items[open].label} – galéria nézet`}
          >
            {/* Bezárás */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors"
              aria-label="Bezárás"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            {/* Előző */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-6 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors"
              aria-label="Előző kép"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>

            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden"
            >
              <PlaceholderImage index={items[open].index} label={items[open].label} />
            </motion.div>

            {/* Következő */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 sm:right-6 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-mist/70 hover:text-mist hover:border-pine-400/50 transition-colors"
              aria-label="Következő kép"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-mist/60">
              {items[open].label} · {open + 1} / {items.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
