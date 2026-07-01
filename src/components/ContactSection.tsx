"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import Logo from "./Logo";
import { PinIcon, PhoneIcon, MailIcon, CheckIcon } from "./Icons";
import { CONTACT } from "@/lib/site";

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-mist placeholder:text-mist/50 focus:outline-none focus:border-pine-400/60 focus:bg-white/[0.06] transition-colors";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: valós beküldés – POST egy /api/kapcsolat route-ra, amely e-mailt
    // küld a holidayvendeghaz2024@gmail.com címre (szerződés III. – kapcsolati
    // űrlap e-mail értesítéssel).
    setSent(true);
  }

  return (
    <section id="kapcsolat" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Kapcsolat"
          title={<>Kérdése van? Írjon nekünk</>}
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Készséggel állunk rendelkezésére."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Elérhetőségek + térkép helye */}
          <AnimatedSection className="flex flex-col gap-6">
            <div className="grid sm:grid-cols-1 gap-4">
              <ContactRow icon={<PinIcon className="w-5 h-5" />} label="Cím">
                {CONTACT.postalCode} {CONTACT.city}, {CONTACT.street}
              </ContactRow>
              <ContactRow icon={<PhoneIcon className="w-5 h-5" />} label="Telefon">
                <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-pine-300 transition-colors">
                  {CONTACT.phone}
                </a>
              </ContactRow>
              <ContactRow icon={<MailIcon className="w-5 h-5" />} label="E-mail">
                <a href={`mailto:${CONTACT.email}`} className="hover:text-pine-300 transition-colors break-all">
                  {CONTACT.email}
                </a>
              </ContactRow>
            </div>

            {/* Térkép helye */}
            <div className="relative flex-1 min-h-56 rounded-3xl overflow-hidden glass-card flex items-center justify-center">
              <div className="absolute inset-0 pine-glow opacity-50" />
              <div className="relative text-center px-6">
                <span className="text-pine-400/40 flex justify-center mb-3">
                  <Logo className="w-12 h-12" strokeWidth={3} />
                </span>
                <p className="text-sm text-mist/45">
                  Térkép helye –{" "}
                  <span className="text-mist/70">{CONTACT.addressShort}</span>
                </p>
                <p className="text-[11px] text-mist/30 mt-2">
                  (Beágyazott térkép élesítés előtt kerül ide)
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Űrlap */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-3xl p-5 sm:p-7 h-full">
              {sent ? (
                <div className="h-full min-h-72 flex flex-col items-center justify-center text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pine-500/20 text-pine-300 mb-4">
                    <CheckIcon className="w-7 h-7" />
                  </span>
                  <h3 className="font-heading text-xl text-mist mb-2">Üzenetét megkaptuk!</h3>
                  <p className="text-sm text-mist/55 max-w-xs">
                    Lorem ipsum dolor sit amet. Hamarosan válaszolunk a megadott
                    e-mail címen.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm font-semibold text-pine-300 hover:text-pine-200 transition-colors"
                  >
                    Új üzenet
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <label htmlFor="c-name" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">Név</span>
                    <input id="c-name" name="name" type="text" required autoComplete="name" className={inputCls} placeholder="Teljes név" />
                  </label>
                  <label htmlFor="c-email" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">E-mail</span>
                    <input id="c-email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="pelda@email.hu" />
                  </label>
                  <label htmlFor="c-message" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">Üzenet</span>
                    <textarea id="c-message" name="message" rows={5} required className={inputCls} placeholder="Lorem ipsum dolor sit amet…" />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-pine-500 px-6 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors"
                  >
                    Üzenet küldése
                  </button>
                  <p className="text-[11px] text-mist/60 text-center leading-relaxed">
                    Az üzenet elküldésével elfogadja az{" "}
                    <a href="/adatkezeles" className="text-pine-300 hover:underline">adatkezelési tájékoztatót</a>.
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-pine-500/10 text-pine-400 shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-mist/40 mb-1">{label}</p>
        <p className="text-sm text-mist/80">{children}</p>
      </div>
    </div>
  );
}
