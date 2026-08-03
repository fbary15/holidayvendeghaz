"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Cookie-hozzájárulás (consent banner) – a szerződés III. (GDPR & Cookie) pontja
 * szerint. A döntést localStorage-ban tároljuk. A tényleges mérő/analitikai
 * sütiket csak elfogadás után szabad betölteni (ide köthető be később az
 * analitika inicializálása).
 *
 * ⚠️ A süti- és adatkezelési megfelelőségért a szerződés X. pontja szerint a
 * Megbízó felel; javasolt ügyvédi átnézés.
 */

const STORAGE_KEY = "holiday-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage nem elérhető – csendben elrejtjük a bannert */
    }
    setVisible(false);
    // TODO: elfogadás esetén itt indítható a mérő/analitikai szkript.
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6"
          role="dialog"
          aria-label="Süti hozzájárulás"
          aria-live="polite"
        >
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-5 shadow-2xl shadow-black/50 bg-coal-900/95">
            <div className="flex-1">
              <p className="text-sm text-mist/70 leading-relaxed">
                Weboldalunk a működéséhez feltétlenül szükséges sütiket használ.
                Mérő- vagy marketingsütiket csak az Ön hozzájárulásával helyeznénk el –
                jelenleg ilyeneket nem alkalmazunk. Részletek a{" "}
                <Link href="/suti-szabalyzat" className="text-pine-300 hover:underline">
                  süti szabályzatban
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-mist/70 hover:text-mist hover:border-white/30 transition-colors"
              >
                Elutasítom
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="rounded-full bg-pine-500 px-6 py-2.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors"
              >
                Elfogadom
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
