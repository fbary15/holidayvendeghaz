import Link from "next/link";
import Logo from "./Logo";
import { CONTACT } from "@/lib/site";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-coal-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-3">
              <span className="text-pine-400">
                <Logo className="w-10 h-10" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-xl font-semibold text-mist">
                  Holiday Vendégház
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-pine-400/90 font-medium mt-1">
                  Békésszentandrás
                </span>
              </span>
            </div>
            <p className="mt-6 text-mist/50 text-sm leading-relaxed">
              Csendes, modern pihenőhely a Hármas-Körös holtága mellett. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Navigáció */}
          <nav aria-label="Lábléc navigáció">
            <h3 className="text-mist font-semibold text-sm mb-4">Oldalak</h3>
            <ul className="space-y-3 text-sm text-mist/55">
              <li>
                <Link href="/#bemutatkozas" className="hover:text-pine-300 transition-colors">
                  Bemutatkozás
                </Link>
              </li>
              <li>
                <Link href="/#szolgaltatasok" className="hover:text-pine-300 transition-colors">
                  Szolgáltatások
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-pine-300 transition-colors">
                  Galéria
                </Link>
              </li>
              <li>
                <Link href="/#foglalas" className="hover:text-pine-300 transition-colors">
                  Foglalás
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kapcsolat */}
          <div>
            <h3 className="text-mist font-semibold text-sm mb-4">Kapcsolat</h3>
            <address className="not-italic space-y-3 text-sm text-mist/55">
              <p className="leading-relaxed">
                {CONTACT.postalCode} {CONTACT.city},<br />
                {CONTACT.street}
              </p>
              <p>
                <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-pine-300 transition-colors">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-pine-300 transition-colors break-all">
                  {CONTACT.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Alsó sáv */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col gap-4 sm:flex-row items-center justify-between">
          <p className="text-mist/55 text-xs text-center sm:text-left">
            © {year} Holiday Vendégház · NTAK: {CONTACT.ntak}
          </p>
          <nav aria-label="Jogi információk" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-mist/55">
            <Link href="/aszf" className="hover:text-pine-300 transition-colors">
              ÁSZF
            </Link>
            <Link href="/adatkezeles" className="hover:text-pine-300 transition-colors">
              Adatkezelési tájékoztató
            </Link>
            <Link href="/suti-szabalyzat" className="hover:text-pine-300 transition-colors">
              Süti szabályzat
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-center text-[11px] text-mist/50">
          Készítette: Prometheus Digital
        </p>
      </div>
    </footer>
  );
}
