/**
 * Central site configuration for Holiday Vendégház.
 *
 * ⚠️ FONTOS: Élesítés (Go-Live) előtt a SITE_URL-t a valódi éles domainre kell
 * cserélni. Ezt használjuk a canonical URL-ekhez, az Open Graph tagekhez, a
 * robots.txt-hez és a sitemaphoz.
 */
export const SITE_URL = "https://holidayvendeghaz.hu";

export const SITE_NAME = "Holiday Vendégház";

export const SITE_DESCRIPTION =
  "Holiday Vendégház Békésszentandráson, a Siratói üdülősoron – csendes, modern pihenőhely a Hármas-Körös holtága mellett. Foglaljon szállást közvetlenül, kényelmesen.";

/** Kapcsolati és cégadatok – a szerződésben és a megrendelő által megadott adatok. */
export const CONTACT = {
  /** Megjelenítendő cím (rövid). */
  addressShort: "Békésszentandrás, Siratói üdülősor 11.",
  street: "Siratói üdülősor 11.",
  city: "Békésszentandrás",
  postalCode: "5561",
  country: "Magyarország",
  phone: "+36 30 972 4942",
  /** tel: href formátum (szóközök nélkül). */
  phoneHref: "+36309724942",
  email: "holidayvendeghaz2024@gmail.com",
  /** NTAK regisztrációs szám (szerződés szerint). */
  ntak: "MA24096848",
  /** Üzemeltető (szerződés szerint). */
  operator: "Kiss Tibor",
  /** Hozzávetőleges földrajzi koordináták (Békésszentandrás, Siratói üdülősor). */
  geo: { lat: 46.8686, lng: 20.4869 },
} as const;
