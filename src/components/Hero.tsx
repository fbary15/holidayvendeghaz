"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";
import PhotoImage from "./PhotoImage";
import { PinIcon, PhoneIcon } from "./Icons";
import { CONTACT } from "@/lib/site";
import { HERO } from "@/lib/photos";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Hero() {
  return (
    <section
      id="kezdolap"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Háttér: valódi légifotó a vendégházról + sötét fátyol az olvashatóságért */}
      <div className="absolute inset-0 bg-coal-950" />
      <PhotoImage photo={HERO} sizes="100vw" priority className="scale-105" />
      <div className="absolute inset-0 bg-coal-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-coal-950/85 via-coal-950/35 to-coal-950" />
      <div className="absolute inset-0 pine-glow opacity-30" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-coal-950 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-28 pb-24">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center"
        >
          <span className="text-pine-400 animate-float-slow">
            <Logo className="w-16 h-16 md:w-20 md:h-20" strokeWidth={3.5} />
          </span>
        </motion.div>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="section-subtitle text-pine-400 mt-8 mb-6"
        >
          {CONTACT.city} · Siratói üdülősor
        </motion.p>

        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight"
        >
          <span className="text-mist">Holiday</span>{" "}
          <span className="gradient-text">Vendégház</span>
        </motion.h1>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 text-lg md:text-xl text-mist/60 max-w-2xl mx-auto leading-relaxed"
        >
          Teljes felszereltség, wellness és háborítatlan nyugalom a Hármas-Körös
          holtága mellett – 3 hálószoba akár 6 főnek, saját stéggel, egész éves
          jakuzzival és szezonális medencével.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-11 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/#foglalas"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-pine-500 px-8 py-4 text-base font-semibold text-coal-950 hover:bg-pine-400 transition-colors duration-300 shadow-lg shadow-pine-500/20 w-full sm:w-auto"
          >
            Foglalok
          </Link>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-mist hover:border-pine-400/60 hover:text-pine-300 transition-colors duration-300 w-full sm:w-auto"
          >
            Galéria megtekintése
          </Link>
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm text-mist/55"
        >
          <span className="inline-flex items-center gap-2">
            <PinIcon className="w-4 h-4 text-pine-400" />
            {CONTACT.addressShort}
          </span>
          <a
            href={`tel:${CONTACT.phoneHref}`}
            className="inline-flex items-center gap-2 hover:text-pine-300 transition-colors"
          >
            <PhoneIcon className="w-4 h-4 text-pine-400" />
            {CONTACT.phone}
          </a>
        </motion.div>
      </div>

      {/* Görgetés jelző */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="w-6 h-10 rounded-full border-2 border-mist/20 flex justify-center pt-2">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-pine-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
