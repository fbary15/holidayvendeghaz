import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Galéria",
  description:
    "Fotógaléria a Holiday Vendégházról Békésszentandráson – belső terek, szobák, kert és a Körös-parti környék.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-coal-950 pt-32 pb-24 noise-overlay">
        <div className="absolute inset-0 pine-glow opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <header className="max-w-2xl">
            <p className="section-subtitle text-pine-400 mb-4">Galéria</p>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold text-mist leading-[1.05] tracking-tight">
              Fedezze fel a{" "}
              <span className="gradient-text">vendégházat</span>
            </h1>
            <p className="mt-6 text-mist/55 text-base md:text-lg leading-relaxed">
              Tekintse meg a Holiday Vendégházat kívül-belül: a fedett teraszt és a
              wellness-részt, a világos belső tereket, a saját stéget és a
              Hármas-Körös holtágának partján fekvő, háborítatlan környezetet.
            </p>
          </header>

          <div className="mt-14">
            <Gallery />
          </div>
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
