import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_INDEXABLE, CONTACT } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

// Saját kiszolgálású betűk a next/font-on keresztül (nincs kérés a Google
// szerverei felé → GDPR-barát). A "latin-ext" subset a magyar ékezetekhez (ő, ű) kell.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const TITLE = "Holiday Vendégház – Békésszentandrás";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Holiday Vendégház",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Holiday Vendégház",
    "vendégház Békésszentandrás",
    "szállás Békésszentandrás",
    "Siratói üdülősor",
    "Körös-part szállás",
    "holtág nyaraló",
    "vendégház foglalás",
    "pihenés Békés megye",
    "horgász szállás",
    "vidéki nyaralás",
  ],
  authors: [{ name: "Holiday Vendégház" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  // Élesítésig (SITE_INDEXABLE) noindex – a robots.txt mellett fejlécszinten is,
  // mert a robots.txt csak a bejárást tiltja, az indexelést nem mindig.
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": `${SITE_URL}/#lodging`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  inLanguage: "hu-HU",
  currenciesAccepted: "HUF",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.street,
    addressLocality: CONTACT.city,
    postalCode: CONTACT.postalCode,
    addressCountry: "HU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT.geo.lat,
    longitude: CONTACT.geo.lng,
  },
  // NTAK regisztrációs szám (szerződés szerint).
  identifier: {
    "@type": "PropertyValue",
    name: "NTAK",
    value: CONTACT.ntak,
  },
  amenityFeature: [
    "Egész éves, fűtött jakuzzi",
    "Szezonális medence",
    "Ingyenes Wi-Fi",
    "Hűtő-fűtő klíma",
    "Saját stég és csónak",
    "Kerti sütő és bográcsozó",
    "Tágas parkoló",
    "3 hálószoba (max. 6 fő)",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased bg-coal-950 text-mist overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        {children}
        {/*
          Látogatottság-mérés (fejlesztési szerződés 10.1.). Vercel Web Analytics:
          süti nélkül működik, ezért nem igényel hozzájárulást, és nem hoz be új
          adatfeldolgozót – a Vercel amúgy is a tárhelyszolgáltató. A szkript
          saját domainről (`/_vercel/insights/…`) töltődik, így a CSP-t sem kell
          lazítani.
        */}
        <Analytics />
      </body>
    </html>
  );
}
