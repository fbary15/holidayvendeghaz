import AnimatedSection from "./AnimatedSection";

/**
 * Egységes szekció-fejléc: kicsi zöld „kicker” felirat + nagy serif cím,
 * opcionális alcímmel. A `center` prop középre igazít.
 */
export default function SectionHeading({
  kicker,
  title,
  subtitle,
  center = false,
}: {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <AnimatedSection
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      <p className="section-subtitle text-pine-400 mb-4">{kicker}</p>
      <h2 className="font-heading text-4xl md:text-5xl font-semibold text-mist leading-[1.1] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-mist/55 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}
