"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";
import { ImagesIcon } from "./Icons";

// A főoldal szakaszaira mutató horgony-linkek. A „Galéria” szándékosan nincs
// köztük: ez az egyetlen valódi aloldal, ezért külön, kiemelten jelenik meg a
// menü szélén.
const navLinks = [
  { href: "/#bemutatkozas", label: "Bemutatkozás" },
  { href: "/#szolgaltatasok", label: "Szolgáltatások" },
  { href: "/#foglalas", label: "Foglalás" },
  { href: "/#velemenyek", label: "Vélemények" },
  { href: "/#kapcsolat", label: "Kapcsolat" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Holiday Vendégház – kezdőlap">
      <span className="text-pine-400 group-hover:text-pine-300 transition-colors duration-300">
        <Logo className="w-9 h-9 md:w-10 md:h-10" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg md:text-xl font-semibold text-mist">
          Holiday Vendégház
        </span>
        <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-pine-400/90 font-medium mt-1">
          Békésszentandrás
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-coal-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-white/5 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Wordmark />

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-mist/70 hover:text-mist transition-colors duration-300 text-sm tracking-wide font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-to-r from-pine-400 to-pine-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}

            <span className="h-5 w-px bg-white/10" aria-hidden="true" />

            {/* Galéria – az egyetlen valódi aloldal, kiemelten, közvetlenül a
                Foglalok CTA előtt. */}
            <Link
              href="/galeria"
              className="group inline-flex items-center gap-2 rounded-full border border-pine-400/50 bg-pine-500/10 px-5 py-2.5 text-sm font-semibold text-pine-200 hover:bg-pine-500/20 hover:border-pine-400 transition-colors duration-300"
            >
              <ImagesIcon className="w-4 h-4 text-pine-300 group-hover:text-pine-200 transition-colors" />
              Galéria
            </Link>

            <Link
              href="/#foglalas"
              className="inline-flex items-center gap-2 rounded-full bg-pine-500 px-5 py-2.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors duration-300"
            >
              Foglalok
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 relative z-50"
            aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-mist origin-center"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="block w-6 h-[2px] bg-mist"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-mist origin-center"
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-coal-950/98 backdrop-blur-2xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-mist/80 hover:text-mist transition-colors py-3 text-lg font-heading border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Galéria – kiemelt aloldal */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/galeria"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pine-400/50 bg-pine-500/10 px-5 py-3 text-sm font-semibold text-pine-200 hover:bg-pine-500/20 transition-colors"
                >
                  <ImagesIcon className="w-4 h-4" />
                  Galéria
                </Link>
              </motion.div>

              <Link
                href="/#foglalas"
                onClick={() => setMenuOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine-500 px-5 py-3 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors"
              >
                Foglalok
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
