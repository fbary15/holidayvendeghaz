"use client";

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Élesítésben ide köthető be a hibanaplózás.
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen bg-coal-950 text-mist flex items-center justify-center px-6 noise-overlay">
      <div className="absolute inset-0 pine-glow opacity-40 pointer-events-none" />
      <div className="relative text-center max-w-md">
        <span className="text-pine-400 flex justify-center mb-8">
          <Logo className="w-16 h-16" strokeWidth={3.5} />
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-mist mb-4">
          Hoppá, valami hiba történt
        </h1>
        <p className="text-mist/55 mb-10 leading-relaxed">
          Kérjük, próbálja újra, vagy térjen vissza a kezdőlapra. Ha a hiba továbbra is
          fennáll, keressen minket telefonon.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-pine-500 px-7 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors w-full sm:w-auto justify-center"
          >
            Újrapróbálás
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-mist hover:border-pine-400/60 hover:text-pine-300 transition-colors w-full sm:w-auto justify-center"
          >
            Főoldal
          </Link>
        </div>
      </div>
    </main>
  );
}
