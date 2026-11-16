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
  /**
   * A „Sirató üdülőtelep” utca középpontja (OpenStreetMap). A 11-es házszám az
   * OSM-ben nincs felvéve, ezért ez utca-szintű pontosság – a navigációhoz
   * ezért a Megbízó saját Google Maps linkjét használjuk (`mapsUrl`).
   */
  geo: { lat: 46.8843, lng: 20.4686 },
  /** A Megbízó által küldött pontos helymegjelölés (2026-07-31). */
  mapsUrl: "https://maps.app.goo.gl/LnAVFbFJiVFLpJ6U6",
} as const;

/**
 * A foglalás menete – a Megbízó tényleges folyamata szerint (a visszaigazoló és
 * az előleg beérkezése után küldött e-mailjei alapján, 2026-07-31).
 */
export const BOOKING_FLOW = {
  /** Ennyi napon belül kell átutalni a foglalót a visszaigazolás után. */
  depositDays: 3,
  /** Ennyi nappal az érkezés előttig díjmentes a lemondás. */
  freeCancelDays: 30,
  checkInFrom: "14:00",
  checkOutBy: "10:00",
  /** Érkezés előtt ennyivel kéri a telefonos jelzést. */
  callBeforeHours: 1,
  steps: [
    {
      title: "Foglalási igény",
      text: "Kiválasztja az időpontot a naptárban, és elküldi a foglalási igényt. Erről azonnal visszajelzést kap e-mailben.",
    },
    {
      title: "Árajánlat és foglaló",
      text: "Elküldjük az árajánlatot, a foglaló összegét és a lemondási feltételeket. A foglaló a teljes összeg 30%-a, amelyet a visszaigazolástól számított 3 napon belül kérünk átutalni.",
    },
    {
      title: "Előlegszámla",
      text: "A foglalóról előlegszámlát állítunk ki, és e-mailben megküldjük.",
    },
    {
      title: "Végleges foglalás",
      text: "A foglaló beérkezése után a foglalás véglegessé válik, és elküldjük az érkezéshez szükséges információkat.",
    },
    {
      title: "Érkezés",
      text: "Érkezés 14:00-tól, távozás a távozás napján 10:00-ig. Érkezés előtt körülbelül egy órával kérjük, hívja a tulajdonost. A fennmaradó összeget a helyszínen rendezik.",
    },
  ],
} as const;

/**
 * Árazás évenként – a Megbízó „Árak, foglalás, <év>” szövegei alapján. Az árak
 * a TELJES nyaralóra értendők, éjszakánként. Minden éjszaka a saját évének
 * árlistája szerint árazódik (egy 2026 → 2027 évfordulós tartózkodás vegyes).
 *
 * Új év hozzáadása: új elem a `years` végére, a BOOKING_LIMITS.lastCheckIn
 * kitolása, és ha az előző év már teljesen elmúlt, annak törlése. Olyan
 * éjszakára, amelynek évéhez nincs árlista, nem számolunk árat (egyedi ajánlat).
 */
export const PRICING = {
  /** Minimum foglalható éjszakák száma (minden évben, minden szezonban). */
  minNights: 3,

  years: [
    {
      /** „Árak, foglalás, 2026” – a Megbízó 2026-07-30-i levele. */
      year: 2026,
      /**
       * Szezonok. A `from`/`to` `MM-DD` alakú, és a záró nap beleértendő. Ami
       * egyik tartományba sem esik, az kizárólag ünnepi csomagban foglalható.
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
      /** Ünnepi csomag ára / éjszaka (az adott évi főszezoni ár). */
      holidayPricePerNight: 75_000,
      /**
       * Ünnepnapok: kizárólag csomagban foglalhatók. A csomag minden éjszakáját
       * tartalmaznia kell a foglalásnak (érkezés ≤ `from`, távozás ≥ `to`).
       */
      holidayPackages: [
        { label: "Húsvét", from: "2026-04-03", to: "2026-04-06" },
        { label: "Május 1.", from: "2026-04-30", to: "2026-05-03" },
        { label: "Pünkösd", from: "2026-05-22", to: "2026-05-25" },
        { label: "Szarvasi Szilvanapok", from: "2026-09-10", to: "2026-09-13" },
        { label: "Október 23.", from: "2026-10-22", to: "2026-10-25" },
        // 2026-ban karácsonykor nincs csomag (a Megbízó 2026-08-06-i levele):
        // az időszak szezonáron foglalható, minimum 3 éjszakával.
        { label: "Szilveszter", from: "2026-12-31", to: "2027-01-03" },
      ],
      discount: null,
    },
    {
      /** „Árak, foglalás, 2027” – a Megbízó 2026-11-12-i levele. */
      year: 2027,
      seasons: [
        {
          id: "fo",
          label: "Főszezon",
          period: "június 1. – augusztus 31.",
          pricePerNight: 80_000,
          ranges: [{ from: "06-01", to: "08-31" }],
        },
        {
          id: "elo",
          label: "Elő- és utószezon",
          period: "január 3. – május 31. és szeptember 1. – december 29.",
          pricePerNight: 60_000,
          ranges: [
            { from: "01-03", to: "05-31" },
            { from: "09-01", to: "12-29" },
          ],
        },
      ],
      holidayPricePerNight: 80_000,
      holidayPackages: [
        { label: "Március 15.", from: "2027-03-12", to: "2027-03-15" },
        { label: "Húsvét", from: "2027-03-26", to: "2027-03-29" },
        { label: "Pünkösd", from: "2027-05-14", to: "2027-05-17" },
        { label: "Szarvasi Szilvanapok", from: "2027-09-09", to: "2027-09-12" },
        { label: "Mindenszentek", from: "2027-10-29", to: "2027-11-01" },
        { label: "Karácsony", from: "2027-12-24", to: "2027-12-27" },
        { label: "Szilveszter", from: "2027-12-30", to: "2028-01-02" },
      ],
      /**
       * „január 3. és április 30. valamint október 1. és december 29. között
       * max. 2 fő érkezése esetén vasárnaptól csütörtökig 4 éjszaka foglalásakor
       * kedvezményesen: 40.000 Ft/nyaraló/éj”. Szó szerint vesszük: érkezés
       * vasárnap, távozás csütörtök (pontosan 4 éj), mind a 4 éjszaka a
       * tartományokon belül (a Megbízó 2026-08-03-án pontosította, hogy a
       * tartózkodás időpontja számít), és egyik sem ünnepi csomag.
       */
      discount: {
        pricePerNight: 40_000,
        maxGuests: 2,
        nights: 4,
        /** `Date.getDay()` szerint: 0 = vasárnap. */
        checkInWeekday: 0,
        days: "vasárnaptól csütörtökig",
        period: "január 3. – április 30. és október 1. – december 29.",
        ranges: [
          { from: "01-03", to: "04-30" },
          { from: "10-01", to: "12-29" },
        ],
      },
    },
  ],

  /** Háziállat: legfeljebb ennyi, a megadott éjszakánkénti felárért. */
  pets: { max: 1, feePerNight: 2_500 },

  includes: ["a hűtő-fűtő klímák használati díja", "a jakuzzi használati díja"],
  excludes: ["az idegenforgalmi adó"],

  /**
   * Foglaló (első részlet) – a Megbízó 2026-07-31-i válasza szerint mindig a
   * foglalás teljes összegének 30%-a, amelyről a foglalási igény beérkezésének
   * napján előlegszámlát állít ki és küld e-mailben.
   */
  depositPercent: 30,

  /** A foglalás érvényessé válásának feltétele (Megbízó megfogalmazása szerint). */
  validityNote:
    "A foglalás telefonon vagy e-mailben történő egyeztetést követően, az első részlet átutalásával és a visszaigazolással válik érvényessé.",

  note: "A feltüntetett árak a teljes nyaralóra, éjszakánként értendők. A végleges árat a foglalás visszaigazolásakor erősítjük meg.",
} as const;

/** Ezres tagolású forint, pl. `75 000 Ft`. */
export function formatFt(amount: number): string {
  return `${amount.toLocaleString("hu-HU").replace(/ /g, " ")} Ft`;
}
