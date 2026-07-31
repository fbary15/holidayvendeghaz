/**
 * Egységes, vonalas ikonkészlet (stroke, `currentColor`). Minden ikon 24×24-es
 * viewBox-szal dolgozik, így a méretet a className szélesség/magasság osztályai adják.
 */
type IconProps = { className?: string };

const base = (className = "") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export function WifiIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <path d="M12 18.5h.01" />
    </svg>
  );
}

export function KitchenIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M8 3v6a2 2 0 0 0 2 2h0v10" />
      <path d="M8 3v4M6 3v4M10 3v4" />
      <path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" />
    </svg>
  );
}

export function GardenIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 21v-6" />
      <path d="M12 15c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" />
    </svg>
  );
}

export function ParkingIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </svg>
  );
}

export function GrillIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M5 7h14l-1.5 6.5a5.5 5.5 0 0 1-11 0Z" />
      <path d="M9 17.5 8 21M15 17.5 16 21" />
      <path d="M10 4c0 1-1 1-1 2M13 4c0 1-1 1-1 2" />
    </svg>
  );
}

export function AcIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M7 9h.01M11 9h.01" />
      <path d="M7 16c0 1 1 1.5 1 2.5M12 16c0 1 1 1.5 1 2.5M17 16c0 1 1 1.5 1 2.5" />
    </svg>
  );
}

export function FishIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 12c3-4 8-5 12-5 3 0 5 2 5 5s-2 5-5 5c-4 0-9-1-12-5Z" />
      <path d="M20 12c1-1 1.5-1 1.5-1M17 9.5h.01" />
      <path d="M3 12c-1 0-1-2-1-2M3 12c-1 0-1 2-1 2" />
    </svg>
  );
}

export function BikeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      <path d="M6 16l4-7h5M9 9h4l2.5 7M14 6h2.5" />
    </svg>
  );
}

export function HotTubIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 11h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3Z" />
      <path d="M6 11V8a1.5 1.5 0 0 1 3 0v.5" />
      <path d="M9 6.5c0-1 1-1 1-2M13 6.5c0-1 1-1 1-2M17 6.5c0-1 1-1 1-2" />
    </svg>
  );
}

export function PoolIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 9.5c1.4-1.5 2.8-1.5 4.2 0s2.8 1.5 4.2 0 2.8-1.5 4.2 0 2.8 1.5 4.2 0" />
      <path d="M3 14.5c1.4-1.5 2.8-1.5 4.2 0s2.8 1.5 4.2 0 2.8-1.5 4.2 0 2.8 1.5 4.2 0" />
      <path d="M3 19c1.4-1.5 2.8-1.5 4.2 0s2.8 1.5 4.2 0 2.8-1.5 4.2 0 2.8 1.5 4.2 0" />
    </svg>
  );
}

export function BedIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
      <path d="M3 15h18" />
      <path d="M7 11V9.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 9.5V11" />
      <path d="M4 18v2M20 18v2" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 5c0-1 1-2 2-2h2l1.5 4-2 1.5a12 12 0 0 0 6 6L17 12l4 1.5V16c0 1-1 2-2 2A16 16 0 0 1 4 5Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 7H5.5A1.5 1.5 0 0 0 4 8.5V12h5V7Z" />
      <path d="M9 12c0 3-1.6 4.6-4 5" />
      <path d="M20 7h-3.5A1.5 1.5 0 0 0 15 8.5V12h5V7Z" />
      <path d="M20 12c0 3-1.6 4.6-4 5" />
    </svg>
  );
}

export function ImagesIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 16 4.5-4.5a2 2 0 0 1 2.8 0L20 19.5" />
    </svg>
  );
}
