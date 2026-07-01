import Logo from "./Logo";

/**
 * Ideiglenes „fotó helye” csempe. A szerződés 1.3. pontja szerint a fotózás /
 * tartalomgyártás külön megállapodás tárgya, ezért itt egyelőre stílusos, a
 * témába illő helykitöltő csempéket használunk. Élesítés előtt ezeket kell a
 * Megbízó által biztosított valódi fotókra cserélni.
 */

// Néhány egymástól eltérő, sötét–zöld átmenet, hogy a galéria változatos legyen.
const gradients = [
  "linear-gradient(135deg, #0f4a31 0%, #08090a 70%)",
  "linear-gradient(135deg, #12482b 0%, #0d0f0e 65%)",
  "linear-gradient(160deg, #0e9152 0%, #04120b 75%)",
  "linear-gradient(120deg, #171b19 0%, #0f4a31 130%)",
  "linear-gradient(200deg, #0d7244 0%, #08090a 70%)",
  "linear-gradient(135deg, #08090a 0%, #105a39 140%)",
];

export default function PlaceholderImage({
  index = 0,
  label = "Fotó helye",
  className = "",
}: {
  index?: number;
  label?: string;
  className?: string;
}) {
  const bg = gradients[index % gradients.length];

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: bg }}
      role="img"
      aria-label={`${label} – ideiglenes helykitöltő kép`}
    >
      {/* Finom rácsminta */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Vízjel ház */}
      <span className="absolute inset-0 flex items-center justify-center text-pine-300/15">
        <Logo className="w-1/3 h-1/3 min-w-16 min-h-16" strokeWidth={2.5} />
      </span>
      {/* Felirat */}
      <span className="absolute bottom-3 left-4 text-[11px] tracking-[0.22em] uppercase text-mist/40">
        {label}
      </span>
    </div>
  );
}
