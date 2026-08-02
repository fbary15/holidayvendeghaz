import { CONTACT } from "@/lib/site";

/**
 * Beágyazott térkép – OpenStreetMap.
 *
 * A Google Maps beágyazása NEM használható: a `…/maps?…&output=embed` cím
 * `X-Frame-Options: SAMEORIGIN` fejlécet ad, tehát idegen oldalon nem jelenik
 * meg (üres/törött keret lesz belőle). A hivatalos Google megoldás API-kulcsot
 * igényelne. Az OpenStreetMap kulcs nélkül beágyazható, nem tesz sütit és nem
 * követi a látogatót, ezért nem is kell hozzájáruláshoz kötni.
 *
 * Útvonaltervezéshez a Google Térkép linkje marad – az viszont csak akkor tölt
 * be bármit, ha a vendég rákattint.
 */

const { lat, lng } = CONTACT.geo;

/** Kb. 1,5 km-es kivágat a ház köré. */
const BBOX = [lng - 0.008, lat - 0.004, lng + 0.008, lat + 0.004]
  .map((n) => n.toFixed(4))
  .join(",");

const OSM_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${lat},${lng}`;

/**
 * Útvonaltervezéshez a Megbízó SAJÁT Google Maps linkjét használjuk – az a
 * házra pontosan mutat. A beágyazott térkép jelölője ehhez képest utca-szintű,
 * mert a 11-es házszám az OpenStreetMapben nincs felvéve.
 */
const DIRECTIONS_HREF = CONTACT.mapsUrl;

export default function MapEmbed() {
  return (
    <div className="relative flex-1 min-h-56 rounded-3xl overflow-hidden glass-card">
      <iframe
        src={OSM_SRC}
        title={`Térkép – ${CONTACT.addressShort}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full border-0"
      />

      {/* Útvonaltervezés – a térkép fölött lebegő gomb. */}
      <a
        href={DIRECTIONS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-coal-950/85 backdrop-blur px-4 py-2 text-xs font-semibold text-pine-200 border border-pine-400/40 hover:bg-coal-950 hover:border-pine-400 transition-colors"
      >
        Útvonaltervezés
      </a>
    </div>
  );
}
