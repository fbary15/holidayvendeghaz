/**
 * Central site configuration for Holiday Vendégház.
 *
 * A SITE_URL a canonical URL-ekhez, az Open Graph tagekhez, a robots.txt-hez és
 * a sitemaphoz kell. Környezeti változóval felülírható (pl. ha a véleményezésre
 * szánt verzió más címen fut) – csak szerveroldalon olvassuk.
 */
export const SITE_URL = process.env.SITE_URL ?? "https://holidayvendeghaz.hu";

/**
 * Indexelhető-e az oldal a keresőkben?
 *
 * ⚠️ ALAPÉRTELMEZÉSBEN NEM. Amíg ez nincs bekapcsolva, a robots.txt mindent
 * tilt, és minden oldal `noindex` fejlécet kap. Így a véleményezésre kiküldött
 * `*.vercel.app` verzió nem kerül a Google-be, és nem versenyez később az éles
 * domainnel duplikált tartalomként.
 *
 * ÉLESÍTÉSKOR: a Vercelben állítsd be a `SITE_INDEXABLE=true` változót
 * (Production környezetre), és indíts újra egy deployt.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

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
  /** Adószám (mindkét szerződés fejléce szerint: Kiss Tibor, Holiday Vendégház). */
  taxNumber: "52429501-1-24",
  /** Üzemeltető (szerződés szerint). */
  operator: "Kiss Tibor",
  /** Hozzávetőleges földrajzi koordináták (Békésszentandrás, Siratói üdülősor). */
  geo: { lat: 46.8686, lng: 20.4869 },
} as const;

/**
 * Árazás – a Megbízó által 2026-07-30-án megadott „Árak, foglalás, 2026”
 * alapján. Az árak a TELJES nyaralóra értendők, éjszakánként.
 *
 * Évforduló: a `holidayPackages` konkrét 2026-os dátumokat tartalmaz. Amikor a
 * foglalási ablak átnyúlik 2027-re, a Megbízótól be kell kérni a következő évi
 * ünnepi időpontokat, különben azok a napok sima szezonáron foglalhatók.
 */
export const PRICING = {
  /** Minimum foglalható éjszakák száma (minden szezonban). */
  minNights: 3,

  /**
   * Szezonok. A `from`/`to` `MM-DD` alakú, év nélkül, és a záró nap beleértendő.
   * Ami egyik tartományba sem esik (dec. 31. és jan. 1.), az kizárólag ünnepi
   * csomagban foglalható – lásd `holidayPackages`.
   */
  seasons: [
    {
      id: "fo",
      label: "Főszezon",
      period: "június 1. – augusztus 31.",
      pricePerNight: 75_000,
      ranges: [{ from: "06-01", to: "08-31" }],
    },
    {
      id: "elo",
      label: "Elő- és utószezon",
      period: "január 2. – május 31. és szeptember 1. – december 30.",
      pricePerNight: 55_000,
      ranges: [
        { from: "01-02", to: "05-31" },
        { from: "09-01", to: "12-30" },
      ],
    },
  ],

  /**
   * Ünnepnapok: kizárólag csomagban, főszezoni áron foglalhatók. A csomag
   * dátumai pontosan illeszkedjenek (érkezés = `from`, távozás = `to`).
   */
  holidayPackages: [
    { label: "Húsvét", from: "2026-04-03", to: "2026-04-06" },
    { label: "Május 1.", from: "2026-04-30", to: "2026-05-03" },
    { label: "Pünkösd", from: "2026-05-22", to: "2026-05-25" },
    { label: "Szarvasi Szilvanapok", from: "2026-09-10", to: "2026-09-13" },
    { label: "Október 23.", from: "2026-10-22", to: "2026-10-25" },
    { label: "Karácsony", from: "2026-12-24", to: "2026-12-27" },
    { label: "Szilveszter", from: "2026-12-31", to: "2027-01-03" },
  ],

  /** Ünnepi csomag ára / éjszaka (főszezoni ár). */
  holidayPricePerNight: 75_000,

  /**
   * „A kimaradt 2 éjszakák foglalása esetén: 85.000 Ft/nyaraló/éj.”
   * Ez a Megbízó szövegében KIZÁRÓLAG a főszezonhoz tartozik: csak ott lehet a
   * 3 éjszakás minimum alatt foglalni, és csak akkor, ha a választott időszak
   * pontosan két foglalás közé beszorult rést tölt ki.
   */
  gapFill: { seasonId: "fo", nights: 2, pricePerNight: 85_000 },

  /** Háziállat: legfeljebb ennyi, a megadott éjszakánkénti felárért. */
  pets: { max: 1, feePerNight: 2_500 },

  /**
   * Külön feltételek, amelyeket NEM számolunk automatikusan (a végleges árat a
   * tulajdonos igazolja vissza), de a vendégnek meg kell jelennie:
   */
  conditions: [
    "Április 30-ig, legfeljebb 2 fő érkezése esetén, vasárnap–csütörtök közötti foglalás kedvezményesen: 35.000 Ft/nyaraló/éj.",
    "Főszezonban a két foglalás közé beszorult, kimaradt 2 éjszaka is foglalható: 85.000 Ft/nyaraló/éj.",
  ],

  includes: ["a hűtő-fűtő klímák használati díja", "a jakuzzi használati díja"],
  excludes: ["az idegenforgalmi adó"],

  /** A foglalás érvényessé válásának feltétele (Megbízó megfogalmazása szerint). */
  validityNote:
    "A foglalás telefonon vagy e-mailben történő egyeztetést követően, az első részlet átutalásával és a visszaigazolással válik érvényessé.",

  note: "A feltüntetett árak a teljes nyaralóra, éjszakánként értendők. A végleges árat a foglalás visszaigazolásakor erősítjük meg.",
} as const;

/** Ezres tagolású forint, pl. `75 000 Ft`. */
export function formatFt(amount: number): string {
  return `${amount.toLocaleString("hu-HU").replace(/ /g, " ")} Ft`;
}
