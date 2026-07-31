"use client";

import { useState } from "react";
import Logo from "./Logo";
import { PinIcon } from "./Icons";
import { CONTACT } from "@/lib/site";

/**
 * Beágyazott térkép – KATTINTÁSRA tölt be.
 *
 * A Google Maps iframe betöltése sütiket és a Google felé irányuló kérést
 * jelentene, ezért alapból csak egy statikus panelt mutatunk, és a vendég
 * kattintására töltjük be. Így a süti-hozzájárulással sem ütközik, és nem lassít
 * az oldalbetöltésen.
 */

const QUERY = `${CONTACT.postalCode} ${CONTACT.city}, ${CONTACT.street}`;
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(QUERY)}&hl=hu&z=16&output=embed`;
const EXTERNAL_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY)}`;

export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative flex-1 min-h-56 rounded-3xl overflow-hidden glass-card">
        <iframe
          src={EMBED_SRC}
          title={`Térkép – ${CONTACT.addressShort}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-56 rounded-3xl overflow-hidden glass-card flex items-center justify-center">
      <div className="absolute inset-0 pine-glow opacity-50" />
      <div className="relative text-center px-6 py-8">
        <span className="text-pine-400/40 flex justify-center mb-3">
          <Logo className="w-12 h-12" strokeWidth={3} />
        </span>
        <p className="text-sm text-mist/70 font-medium">{CONTACT.addressShort}</p>

        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine-400/50 bg-pine-500/10 px-5 py-2.5 text-sm font-semibold text-pine-200 hover:bg-pine-500/20 hover:border-pine-400 transition-colors"
        >
          <PinIcon className="w-4 h-4" />
          Térkép betöltése
        </button>

        <p className="mt-3 text-[11px] text-mist/40 leading-relaxed max-w-xs mx-auto">
          A térkép betöltésével a Google Maps tartalma töltődik be.{" "}
          <a
            href={EXTERNAL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pine-300/70 hover:text-pine-300 underline"
          >
            Megnyitás új ablakban
          </a>
        </p>
      </div>
    </div>
  );
}
