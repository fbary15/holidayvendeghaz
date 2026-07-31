"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import MapEmbed from "./MapEmbed";
import { PinIcon, PhoneIcon, MailIcon, CheckIcon } from "./Icons";
import { CONTACT } from "@/lib/site";
import { LIMITS, submitContactForm, type FormStatus } from "@/lib/contact";

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-mist placeholder:text-mist/50 focus:outline-none focus:border-pine-400/60 focus:bg-white/[0.06] transition-colors";

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    const ok = await submitContactForm({
      type: "kapcsolat",
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    });

    if (ok) {
      form.reset();
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <section id="kapcsolat" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Kapcsolat"
          title={<>Kérdése van? Írjon nekünk</>}
          subtitle="Kérdése van a foglalással vagy a szálláshellyel kapcsolatban? Írjon nekünk, és készséggel állunk rendelkezésére."
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

            <MapEmbed />
          </AnimatedSection>

          {/* Űrlap */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-3xl p-5 sm:p-7 h-full">
              {status === "success" ? (
                <div className="h-full min-h-72 flex flex-col items-center justify-center text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pine-500/20 text-pine-300 mb-4">
                    <CheckIcon className="w-7 h-7" />
                  </span>
                  <h3 className="font-heading text-xl text-mist mb-2">Üzenetét megkaptuk!</h3>
                  <p className="text-sm text-mist/55 max-w-xs">
                    Köszönjük! Hamarosan válaszolunk a megadott e-mail címen.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-pine-300 hover:text-pine-200 transition-colors"
                  >
                    Új üzenet
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label htmlFor="c-name" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">Név</span>
                    <input id="c-name" name="name" type="text" required maxLength={LIMITS.name} autoComplete="name" className={inputCls} placeholder="Teljes név" />
                  </label>
                  <label htmlFor="c-email" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">E-mail</span>
                    <input id="c-email" name="email" type="email" required maxLength={LIMITS.email} autoComplete="email" className={inputCls} placeholder="pelda@email.hu" />
                  </label>
                  <label htmlFor="c-message" className="block">
                    <span className="block text-xs font-medium text-mist/55 mb-1.5">Üzenet</span>
                    <textarea id="c-message" name="message" rows={5} required maxLength={LIMITS.message} className={inputCls} placeholder="Miben segíthetünk?" />
                  </label>

                  {/* Honeypot: képernyőn kívül (nem sr-only, hogy a felolvasó se mondja ki),
                      és nem disabled — a botok a disabled mezőket átugorják. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                    <label htmlFor="c-company">Cég</label>
                    <input type="text" id="c-company" name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-full bg-pine-500 px-6 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Küldés…" : "Üzenet küldése"}
                  </button>

                  {status === "error" && (
                    <p role="status" className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-200">
                      Sajnos hiba történt a küldés során. Kérjük, próbálja meg később, vagy írjon
                      közvetlenül a{" "}
                      <a href={`mailto:${CONTACT.email}`} className="underline break-all">
                        {CONTACT.email}
                      </a>{" "}
                      címre.
                    </p>
                  )}

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
