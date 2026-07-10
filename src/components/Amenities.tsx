import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import {
  WifiIcon,
  HotTubIcon,
  PoolIcon,
  ParkingIcon,
  GrillIcon,
  AcIcon,
  FishIcon,
  BedIcon,
} from "./Icons";

const amenities = [
  {
    icon: HotTubIcon,
    title: "Egész éves jakuzzi",
    desc: "Fűtött, privát jakuzzi, amelyet az év bármely szakában, minden évszakban élvezhet.",
  },
  {
    icon: PoolIcon,
    title: "Szezonális medence",
    desc: "A forró nyári napokon hűsítő medence a saját kertben, kizárólag az Önök számára.",
  },
  {
    icon: AcIcon,
    title: "Hűtő-fűtő klíma",
    desc: "Kellemes hőmérséklet minden szobában – nyáron hűvös, a hidegebb napokon meleg.",
  },
  {
    icon: WifiIcon,
    title: "Ingyenes Wi-Fi",
    desc: "Stabil internetkapcsolat a kikapcsolódáshoz és a folyamatos elérhetőséghez.",
  },
  {
    icon: FishIcon,
    title: "Saját stég és csónak",
    desc: "Dobja be a botot a saját stégről, vagy szálljon vízre a csónakkal a holtágon.",
  },
  {
    icon: GrillIcon,
    title: "Kerti sütő és bográcsozó",
    desc: "Készítsen finom vacsorát a szabadban, klasszikus Körös-parti hangulatban.",
  },
  {
    icon: ParkingIcon,
    title: "Tágas parkoló",
    desc: "Több autó is biztonságosan és kényelmesen elfér az udvarban.",
  },
  {
    icon: BedIcon,
    title: "3 külön hálószoba",
    desc: "Ideális elrendezés akár 6 fős családoknak és baráti társaságoknak.",
  },
];

export default function Amenities() {
  return (
    <section id="szolgaltatasok" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Szolgáltatások"
          title={<>Minden adott a nyugodt pihenéshez</>}
          subtitle="A klímától a wellnessig – nálunk minden megvan a zavartalan, kényelmes feltöltődéshez, az év 365 napján."
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {amenities.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.title} delay={i * 0.06}>
                <div className="glass-card group h-full rounded-2xl p-6 md:p-7 flex flex-col items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pine-500/10 text-pine-400 group-hover:bg-pine-500/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="font-heading text-lg font-medium text-mist">
                    {item.title}
                  </h3>
                  <p className="text-sm text-mist/55 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
