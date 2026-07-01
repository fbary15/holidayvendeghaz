import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-coal-950 text-mist flex items-center justify-center px-6 noise-overlay">
      <div className="absolute inset-0 pine-glow opacity-40 pointer-events-none" />
      <div className="relative text-center max-w-md">
        <span className="text-pine-400 flex justify-center mb-8">
          <Logo className="w-16 h-16" strokeWidth={3.5} />
        </span>
        <p className="section-subtitle text-pine-400 mb-4">404</p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-mist mb-4">
          Az oldal nem található
        </h1>
        <p className="text-mist/55 mb-10 leading-relaxed">
          A keresett oldal sajnos nem létezik, vagy időközben elköltözött. Térjen vissza a
          kezdőlapra.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-pine-500 px-7 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </main>
  );
}
