/**
 * Holiday Vendégház jelkép – letisztult, vonalas ház ikon (az eredeti logó
 * kézjegyét idézve). `currentColor`-t használ, így sötét háttéren élesen fehér
 * vagy zöld lehet, JPG invertálás nélkül.
 */
export default function Logo({
  className = "",
  strokeWidth = 4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Bal fal + tető (jobb oldalon nyitott, az eredeti könnyed vonalvezetését követve) */}
      <path d="M24 86 V44 L50 22 L76 44" />
      {/* Alapvonal */}
      <path d="M24 86 H72" />
      {/* Belső oszlop / keret */}
      <path d="M39 86 V58" />
    </svg>
  );
}
