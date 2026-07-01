import Link from "next/link";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import PlaceholderImage from "./PlaceholderImage";
import { LOREM_SHORT } from "@/lib/lorem";

// Egy kiegyensúlyozott „bento” elrendezés a főoldali galéria-előnézethez.
const tiles = [
  { label: "Nappali", span: "md:col-span-2 md:row-span-2", index: 0 },
  { label: "Hálószoba", span: "", index: 1 },
  { label: "Konyha", span: "", index: 3 },
  { label: "Kert", span: "", index: 2 },
  { label: "Környék", span: "", index: 4 },
];

export default function GalleryPreview() {
  return (
    <section id="galeria" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            kicker="Galéria"
            title={<>Pillantás a vendégházba</>}
            subtitle={LOREM_SHORT}
          />
          <AnimatedSection>
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-mist hover:border-pine-400/60 hover:text-pine-300 transition-colors whitespace-nowrap"
            >
              Összes fotó
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.1}>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className={`rounded-2xl overflow-hidden ${tile.span}`}
              >
                <PlaceholderImage index={tile.index} label={tile.label} />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
