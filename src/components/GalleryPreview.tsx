import Link from "next/link";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import PhotoImage from "./PhotoImage";
import { GALLERY_PREVIEW } from "@/lib/photos";

// Egy kiegyensúlyozott „bento” elrendezés a főoldali galéria-előnézethez.
// Az első csempe a nagy, 2×2-es kiemelt kép.
const spans = ["md:col-span-2 md:row-span-2", "", "", "", ""];

export default function GalleryPreview() {
  return (
    <section id="galeria" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            kicker="Galéria"
            title={<>Pillantás a vendégházba</>}
            subtitle="Néhány pillanatkép a vendégházról, a wellness-részről és a Körös-parti környezetről."
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
            {GALLERY_PREVIEW.map((tile, i) => (
              <div
                key={tile.photo.src}
                className={`group relative rounded-2xl overflow-hidden ${spans[i] ?? ""}`}
              >
                <PhotoImage
                  photo={tile.photo}
                  sizes={i === 0 ? "(max-width: 768px) 50vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-950/75 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-4 text-xs font-medium tracking-wide text-mist/90 drop-shadow">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
