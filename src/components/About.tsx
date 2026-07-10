import AnimatedSection from "./AnimatedSection";
import PhotoImage from "./PhotoImage";
import HoverTilt from "./HoverTilt";
import { CheckIcon } from "./Icons";
import { ABOUT } from "@/lib/photos";

const highlights = [
  "100% privát környezet, nincs szembeszomszéd",
  "Egész éves, fűtött privát jakuzzi",
  "Szezonális medence a nyári napokra",
  "Saját stég, csónak és kerti sütő",
  "Hűtő-fűtő klíma és stabil Wi-Fi",
  "3 külön hálószoba akár 6 főnek",
];

export default function About() {
  return (
    <section id="bemutatkozas" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Képek */}
          <AnimatedSection className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <HoverTilt className="group relative aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                <PhotoImage
                  photo={ABOUT[0]}
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </HoverTilt>
              <HoverTilt className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
                <PhotoImage
                  photo={ABOUT[1]}
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </HoverTilt>
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
                <p>
                  Keresi a tökéletes helyszínt egy közös családi nyaraláshoz vagy
                  egy baráti hétvégéhez? A Holiday Vendégház 3 különálló szobájával
                  akár 6 fő részére nyújt teljes körű otthonosságot a Siratói
                  üdülősoron – az év 365 napján. Nálunk nem kell kompromisszumot
                  kötnie: a ház mindennel maximálisan fel van szerelve, a kellemes
                  hőmérsékletről klíma, a kapcsolattartásról Wi-Fi, az autók
                  biztonságáról pedig tágas parkoló gondoskodik.
                </p>
                <p>
                  Dobja be a botot a saját stégről, vagy üljön csónakba teljesen
                  nyugodtan: a túlparti sűrű nádfalnak köszönhetően nincsenek
                  szembeszomszédok, így senki sem zavarja meg Önöket. Készítsen egy
                  finom vacsorát a kerti sütőben, a forró nyári napokon hűsöljön a
                  szezonális medencében, az év többi részében pedig élvezze az egész
                  évben működő, fűtött privát jakuzzit! Nálunk minden évszakban
                  adott a zavartalan és kényelmes feltöltődés.
                </p>
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
