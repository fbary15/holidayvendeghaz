import Link from "next/link";
import Logo from "./Logo";

/**
 * Közös keret a jogi aloldalakhoz (ÁSZF / Adatkezelés / Süti szabályzat).
 * Server component – a főoldal nehéz animációi nélkül, hogy a jogi szöveg
 * nyugodt és jól olvasható maradjon.
 */
export default function LegalPage({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <main className="relative min-h-screen bg-coal-950 text-mist noise-overlay">
      <div className="absolute inset-0 pine-glow opacity-20 pointer-events-none" />

      {/* Fejléc */}
      <header className="relative z-10 border-b border-white/5 bg-coal-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-pine-400 group-hover:text-pine-300 transition-colors">
              <Logo className="w-9 h-9" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-semibold text-mist">
                Holiday Vendégház
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-pine-400/90 font-medium mt-1">
                Békésszentandrás
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-mist/60 hover:text-mist transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Vissza a főoldalra</span>
          </Link>
        </div>
      </header>

      {/* Tartalom */}
      <article className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="section-subtitle text-pine-400 mb-3">Jogi információk</p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-mist mb-4">{title}</h1>
        {intro && <p className="text-mist/50 text-base mb-2 max-w-2xl">{intro}</p>}
        <p className="text-mist/50 text-xs mb-12">Hatályos: {lastUpdated}</p>
        <div className="legal-prose">{children}</div>
      </article>

      {/* Lábléc */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-mist/50 text-xs">© {year} Holiday Vendégház</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mist/50">
            <Link href="/" className="hover:text-pine-300 transition-colors">Főoldal</Link>
            <Link href="/aszf" className="hover:text-pine-300 transition-colors">ÁSZF</Link>
            <Link href="/adatkezeles" className="hover:text-pine-300 transition-colors">Adatkezelés</Link>
            <Link href="/suti-szabalyzat" className="hover:text-pine-300 transition-colors">Süti szabályzat</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
