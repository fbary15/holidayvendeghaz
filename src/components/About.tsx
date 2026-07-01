import AnimatedSection from "./AnimatedSection";
import PlaceholderImage from "./PlaceholderImage";
import { CheckIcon } from "./Icons";
import { LOREM_PARAGRAPHS } from "@/lib/lorem";

const highlights = [
  "Lorem ipsum dolor sit amet consectetur",
  "Sed do eiusmod tempor incididunt",
  "Ut labore et dolore magna aliqua",
  "Quis nostrud exercitation ullamco",
];

export default function About() {
  return (
    <section id="bemutatkozas" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Képek */}
          <AnimatedSection className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                <PlaceholderImage index={0} label="Vendégház" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <PlaceholderImage index={2} label="Terasz" />
              </div>
            </div>
          </AnimatedSection>

          {/* Szöveg */}
          <div className="order-1 lg:order-2">
            <AnimatedSection>
              <p className="section-subtitle text-pine-400 mb-4">Bemutatkozás</p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-mist leading-[1.1] tracking-tight">
                Otthonos pihenés a<br />
                <span className="gradient-text">Körös partján</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="mt-6 space-y-4 text-mist/55 leading-relaxed">
                <p>{LOREM_PARAGRAPHS[0]}</p>
                <p>{LOREM_PARAGRAPHS[1]}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-mist/70">
                    <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-pine-500/15 text-pine-400 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
