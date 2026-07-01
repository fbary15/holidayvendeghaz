import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "ÁSZF",
  description:
    "A Holiday Vendégház általános szerződési feltételei (ÁSZF) a szálláshely-szolgáltatás igénybevételéhez.",
  alternates: { canonical: "/aszf" },
  robots: { index: false, follow: true },
};

/*
 * ⚠️ SABLON – jogi felülvizsgálat szükséges.
 * A szálláshely-szolgáltatás ÁSZF-jét (foglalás, fizetés, lemondás, házirend) a
 * Megbízó tényleges feltételei szerint kell véglegesíteni, ügyvédi átnézéssel.
 */
export default function AszfPage() {
  return (
    <LegalPage
      title="Általános Szerződési Feltételek"
      intro="A Holiday Vendégház szálláshely-szolgáltatásának igénybevételére vonatkozó általános feltételek."
      lastUpdated="2026. július"
    >
      <p className="legal-todo">
        SABLON – jogi felülvizsgálat szükséges. Az alábbi pontokat (árak, lemondási
        feltételek, házirend) a Megbízó valós feltételeivel kell kitölteni.
      </p>

      <h2>1. A szolgáltató</h2>
      <address>
        <strong>Holiday Vendégház</strong>
        <br />
        Üzemeltető: {CONTACT.operator}
        <br />
        {CONTACT.postalCode} {CONTACT.city}, {CONTACT.street}
        <br />
        NTAK: {CONTACT.ntak}
        <br />
        E-mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> · Telefon:{" "}
        <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
      </address>

      <h2>2. A szolgáltatás tárgya</h2>
      <p>
        A szolgáltató a {CONTACT.city} területén található vendégházban rövid távú
        szálláshely-szolgáltatást nyújt a foglalásban rögzített időtartamra és feltételekkel.
      </p>

      <h2>3. Foglalás és visszaigazolás</h2>
      <p>
        A foglalási igény a weboldalon található foglalási űrlap kitöltésével kezdeményezhető.
        A foglalás a szolgáltató írásbeli (e-mailes) visszaigazolásával válik érvényessé.
        A beküldött igény önmagában még nem jelent megerősített foglalást.
      </p>

      <h2>4. Árak és fizetés</h2>
      <p>
        A szállás díja és a fizetés módja a visszaigazolásban kerül rögzítésre.{" "}
        <span className="legal-todo">[árak, előleg mértéke, fizetési módok és határidők]</span>
      </p>

      <h2>5. Lemondási feltételek</h2>
      <p className="legal-todo">
        [Lemondási és módosítási feltételek – pl. az érkezés előtt hány nappal díjmentes a
        lemondás, ezt követően milyen díj terheli a vendéget.]
      </p>

      <h2>6. Érkezés és távozás</h2>
      <p className="legal-todo">
        [Bejelentkezés (check-in) és kijelentkezés (check-out) időpontjai, az átadás-átvétel
        rendje.]
      </p>

      <h2>7. Házirend</h2>
      <p className="legal-todo">
        [Házirend – pl. csendes pihenő ideje, dohányzás, háziállat, maximális létszám, a
        vendég felelőssége az okozott károkért.]
      </p>

      <h2>8. Panaszkezelés és jogorvoslat</h2>
      <p>
        Esetleges panaszait a fenti elérhetőségeken jelezheti. A fogyasztói jogviták
        rendezéséhez a lakóhely szerint illetékes békéltető testülethez lehet fordulni.
      </p>

      <p className="legal-todo">
        Ez a szöveg tájékoztató jellegű sablon, és nem minősül jogi tanácsadásnak.
      </p>
    </LegalPage>
  );
}
