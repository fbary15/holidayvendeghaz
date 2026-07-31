"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import { CheckIcon, QuoteIcon } from "./Icons";
import { CONTACT } from "@/lib/site";
import { LIMITS, submitContactForm, type FormStatus } from "@/lib/contact";

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-mist placeholder:text-mist/50 focus:outline-none focus:border-pine-400/60 focus:bg-white/[0.06] transition-colors";

/**
 * Vendégkönyv – a vendégek ide írhatják meg a véleményüket. A beküldött
 * szöveg NEM jelenik meg a weboldalon: közvetlenül e-mailben érkezik a
 * tulajdonoshoz (/api/kapcsolat, `velemeny` típus).
 */
export default function FeedbackSection() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    const ok = await submitContactForm({
      type: "velemeny",
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
    <section id="velemenyek" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          center
          kicker="Vendégkönyv"
          title={<>Ossza meg velünk az élményét</>}
          subtitle="Nálunk járt már? Örülünk minden visszajelzésnek – írja meg, hogyan érezte magát. Az üzenet közvetlenül hozzánk érkezik."
        />

        <AnimatedSection delay={0.1} className="mt-12 max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-5 sm:p-8">
            {status === "success" ? (
              <div className="min-h-72 flex flex-col items-center justify-center text-center py-6">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pine-500/20 text-pine-300 mb-4">
                  <CheckIcon className="w-7 h-7" />
                </span>
                <h3 className="font-heading text-xl text-mist mb-2">
                  Köszönjük a véleményét!
                </h3>
                <p className="text-sm text-mist/55 max-w-xs">
                  Nagyon sokat jelent nekünk, hogy időt szánt rá.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-pine-300 hover:text-pine-200 transition-colors"
                >
                  Új vélemény írása
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-pine-500/10 text-pine-400 mb-2">
                  <QuoteIcon className="w-5 h-5" />
                </span>

                <label htmlFor="v-name" className="block">
                  <span className="block text-xs font-medium text-mist/55 mb-1.5">Név</span>
                  <input
                    id="v-name"
                    name="name"
                    type="text"
                    required
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    className={inputCls}
                    placeholder="Teljes név"
                  />
                </label>

                <label htmlFor="v-email" className="block">
                  <span className="block text-xs font-medium text-mist/55 mb-1.5">
                    E-mail <span className="text-mist/35">(nem kötelező)</span>
                  </span>
                  <input
                    id="v-email"
                    name="email"
                    type="email"
                    maxLength={LIMITS.email}
                    autoComplete="email"
                    className={inputCls}
                    placeholder="pelda@email.hu"
                  />
                </label>

                <label htmlFor="v-message" className="block">
                  <span className="block text-xs font-medium text-mist/55 mb-1.5">Vélemény</span>
                  <textarea
                    id="v-message"
                    name="message"
                    rows={6}
                    required
                    maxLength={LIMITS.message}
                    className={inputCls}
                    placeholder="Meséljen róla, hogyan telt a nálunk töltött idő…"
                  />
                </label>

                {/* Honeypot: képernyőn kívül (nem sr-only, hogy a felolvasó se mondja ki),
                    és nem disabled — a botok a disabled mezőket átugorják. */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
                >
                  <label htmlFor="v-company">Cég</label>
                  <input
                    type="text"
                    id="v-company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-pine-500 px-6 py-3.5 text-sm font-semibold text-coal-950 hover:bg-pine-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Küldés…" : "Vélemény elküldése"}
                </button>

                {status === "error" && (
                  <p
                    role="status"
                    className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-200"
                  >
                    Sajnos hiba történt a küldés során. Kérjük, próbálja meg később, vagy írjon
                    közvetlenül a{" "}
                    <a href={`mailto:${CONTACT.email}`} className="underline break-all">
                      {CONTACT.email}
                    </a>{" "}
                    címre.
                  </p>
                )}

                <p className="text-[11px] text-mist/60 text-center leading-relaxed">
                  A vélemény elküldésével elfogadja az{" "}
                  <a href="/adatkezeles" className="text-pine-300 hover:underline">
                    adatkezelési tájékoztatót
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
