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
      <p className="legal-todo">
        SABLON – jogi felülvizsgálat szükséges. Az alábbi szöveg minta; a végleges,
        jogilag megfelelő tartalmat ügyvéddel egyeztetve kell véglegesíteni.
      </p>

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
        <li>Adószám: <span className="legal-todo">[adószám]</span></li>
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
      <p>
        A megadott adatokat a cél megvalósulásához szükséges ideig, de legfeljebb{" "}
        <span className="legal-todo">[megőrzési idő – pl. a foglalást követő 1 év]</span>
        {" "}kezeljük, kivéve, ha jogszabály ennél hosszabb megőrzést ír elő.
      </p>

      <h2>5. Adatfeldolgozók</h2>
      <p>
        A weboldal működéséhez az alábbi adatfeldolgozók szolgáltatásait vesszük igénybe:
      </p>
      <ul>
        <li><strong>Tárhely- és domain-szolgáltató:</strong> <span className="legal-todo">[szolgáltató neve, székhelye]</span></li>
        <li><strong>Foglalási naptár:</strong> Google Ireland Limited (Google Naptár) – a foglalási igények háttérkezeléséhez.</li>
        <li><strong>E-mail szolgáltató:</strong> <span className="legal-todo">[szolgáltató neve]</span></li>
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

      <p className="legal-todo">
        Ez a szöveg tájékoztató jellegű sablon, és nem minősül jogi tanácsadásnak.
      </p>
    </LegalPage>
  );
}
