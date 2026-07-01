import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import {
  WifiIcon,
  KitchenIcon,
  GardenIcon,
  ParkingIcon,
  GrillIcon,
  AcIcon,
  FishIcon,
  BikeIcon,
} from "./Icons";
import { LOREM_SHORT } from "@/lib/lorem";

const amenities = [
  { icon: WifiIcon, title: "Ingyenes WiFi" },
  { icon: KitchenIcon, title: "Felszerelt konyha" },
  { icon: GardenIcon, title: "Kert és terasz" },
  { icon: ParkingIcon, title: "Ingyenes parkolás" },
  { icon: GrillIcon, title: "Grillezési lehetőség" },
  { icon: AcIcon, title: "Klimatizált szobák" },
  { icon: FishIcon, title: "Horgászati lehetőség" },
  { icon: BikeIcon, title: "Kerékpáros túrák" },
];

export default function Amenities() {
  return (
    <section id="szolgaltatasok" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Szolgáltatások"
          title={<>Minden adott a nyugodt pihenéshez</>}
          subtitle={LOREM_SHORT}
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
