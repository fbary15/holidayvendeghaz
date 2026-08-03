import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató",
  description:
    "A Holiday Vendégház adatkezelési tájékoztatója – a személyes adatok kezelése a GDPR és az Infotv. szerint.",
  alternates: { canonical: "/adatkezeles" },
  robots: { index: false, follow: true },
};

/*
 * ⚠️ SABLON – jogi felülvizsgálat szükséges.
 * A szerződés X. pontja szerint az adatkezelés jogi megfelelőségéért kizárólag a
 * Megbízó felel; nyomatékosan javasolt a szöveg ügyvéddel való átnézetése.
 * A sárgával jelölt [placeholder] részeket élesítés előtt ki kell tölteni.
 */
export default function AdatkezelesPage() {
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      intro="Ez a tájékoztató bemutatja, hogyan kezeljük a weboldalunkon megadott személyes adatokat."
      lastUpdated="2026. július"
    >

      <h2>1. Az adatkezelő</h2>
      <address>
        <strong>Holiday Vendégház</strong>
        <br />
        Üzemeltető: {CONTACT.operator}
        <br />
        {CONTACT.postalCode} {CONTACT.city}, {CONTACT.street}
        <br />
        NTAK: {CONTACT.ntak}
      </address>
      <ul>
        <li>Telefon: <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
        <li>E-mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        <li>Adószám: {CONTACT.taxNumber}</li>
      </ul>

      <h2>2. A kezelt adatok köre és célja</h2>
      <p>
        A weboldalon keresztül az alábbi esetekben kezelünk személyes adatokat:
      </p>
      <ul>
        <li>
          <strong>Foglalási igény:</strong> név, e-mail cím, telefonszám, a kiválasztott
          időpont, vendégek száma és az esetleges megjegyzés. Cél: a foglalási igény
          kezelése, visszaigazolása és a kapcsolattartás.
        </li>
        <li>
          <strong>Kapcsolatfelvételi űrlap:</strong> név, e-mail cím és az üzenet
          tartalma. Cél: a megkeresés megválaszolása.
        </li>
        <li>
          <strong>Vendégkönyv (vélemény) űrlap:</strong> név, a vélemény szövege, valamint
          – ha az érintett megadja – az e-mail cím. Cél: a visszajelzés fogadása és a
          szolgáltatás minőségének javítása. A beküldött vélemény nem jelenik meg a
          weboldalon, kizárólag e-mailben jut el a szálláshely üzemeltetőjéhez.
        </li>
        <li>
          <strong>Sütik:</strong> a weboldal működéséhez és látogatottságának méréséhez.
          Részletek a <a href="/suti-szabalyzat">süti szabályzatban</a>.
        </li>
      </ul>

      <h2>3. Az adatkezelés jogalapja</h2>
      <p>
        A foglalási és kapcsolatfelvételi adatok kezelésének jogalapja az érintett
        hozzájárulása (GDPR 6. cikk (1) a) pont), illetve a foglalás esetén a szerződés
        teljesítéséhez szükséges lépések megtétele (GDPR 6. cikk (1) b) pont).
      </p>

      <h2>4. Az adatok tárolásának ideje</h2>
      <ul>
        <li>
          <strong>Foglalási és kapcsolatfelvételi adatok:</strong> a foglalás, illetve a
          megkeresés lezárását követő 1 évig.
        </li>
        <li>
          <strong>Vendégkönyvi visszajelzések:</strong> a beérkezéstől számított 1 évig.
        </li>
        <li>
          <strong>Számlázási adatok:</strong> a számvitelről szóló 2000. évi C. törvény
          169. §-a alapján 8 évig.
        </li>
      </ul>
      <p>
        Az adatokat ezt megelőzően is töröljük, amint az adatkezelés célja megvalósult,
        kivéve, ha jogszabály hosszabb megőrzést ír elő.
      </p>

      <h2>5. Adatfeldolgozók</h2>
      <p>
        A weboldal működéséhez az alábbi adatfeldolgozók szolgáltatásait vesszük igénybe:
      </p>
      <ul>
        <li>
          <strong>Tárhelyszolgáltató és látogatottság-mérés:</strong> Vercel Inc. (Amerikai
          Egyesült Államok) – a weboldal üzemeltetéséhez, valamint süti nélküli, összesített
          látogatottsági statisztikához (Vercel Web Analytics). A mérés nem helyez el sütit,
          és nem alkalmas az egyes látogatók azonosítására.
        </li>
        <li>
          <strong>Domain- és DNS-szolgáltató:</strong> Rackhost Zrt. (Magyarország).
        </li>
        <li>
          <strong>Foglalási naptár:</strong> Google Ireland Limited (Írország) – a foglalási
          igények háttérkezeléséhez (Google Naptár).
        </li>
        <li>
          <strong>E-mail továbbítás (űrlapok):</strong> Resend, Inc. (Amerikai Egyesült
          Államok) – a kapcsolatfelvételi, foglalási és vendégkönyv űrlapok e-mailben történő
          továbbításához. A levelek feldolgozása az Európai Unión belül, írországi régióban
          történik.
        </li>
        <li>
          <strong>E-mail postafiók:</strong> Google Ireland Limited (Írország) – a beérkező
          üzenetek fogadásához (Gmail).
        </li>
      </ul>

      <h2>6. Az érintett jogai</h2>
      <p>
        Az érintett kérheti a rá vonatkozó adatokhoz való hozzáférést, azok helyesbítését,
        törlését vagy kezelésének korlátozását, továbbá tiltakozhat az adatkezelés ellen és
        élhet az adathordozhatósághoz való jogával. A hozzájárulás bármikor visszavonható.
      </p>

      <h2>7. Jogorvoslat</h2>
      <p>
        Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) lehet
        fordulni: 1055 Budapest, Falk Miksa utca 9-11.,{" "}
        <a href="https://naih.hu" target="_blank" rel="noopener noreferrer">naih.hu</a>.
      </p>

    </LegalPage>
  );
}
