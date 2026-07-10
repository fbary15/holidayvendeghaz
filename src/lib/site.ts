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
  "Holiday Vendégház Békésszentandráson, a Siratói üdülősoron – 3 hálószobás, teljesen felszerelt pihenőhely a Hármas-Körös holtága mellett, saját stéggel, egész éves jakuzzival és szezonális medencével. Foglaljon szállást közvetlenül, kényelmesen.";

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

/**
 * Árazás – ⚠️ HELYKITÖLTŐ. A végleges árakat a Megbízó adja meg. Amíg a
 * `placeholder` értéke `true`, az oldalon jól láthatóan, „megadandó" jelöléssel
 * jelenik meg az ár. Élesítés előtt:
 *   1) töltsd ki a `perNight` (és opcionálisan a `deposit`) mezőt,
 *   2) állítsd a `placeholder` értékét `false`-ra,
 *   3) igény szerint pontosítsd a `note` szöveget.
 */
export const PRICING = {
  placeholder: true,
  /** Ár / éjszaka, kész szövegként (pl. "35 000 Ft"). Élesítés előtt kitöltendő. */
  perNight: "",
  /** Opcionális foglaló (pl. "a teljes összeg 30%-a"); üresen elrejtve. */
  deposit: "",
  /** Rövid megjegyzés az ár mellett. */
  note: "A pontos, szezonális árakért és ajánlatért kérjük, vegye fel velünk a kapcsolatot.",
} as const;
