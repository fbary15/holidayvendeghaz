import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Süti szabályzat",
  description:
    "A Holiday Vendégház süti (cookie) szabályzata – milyen sütiket használunk és mire.",
  alternates: { canonical: "/suti-szabalyzat" },
  robots: { index: false, follow: true },
};

/*
 * ⚠️ SABLON – jogi felülvizsgálat szükséges (szerződés X. pont).
 * A ténylegesen használt sütik listáját a végleges technikai megoldás alapján
 * kell pontosítani (pl. mérő/analitikai szolgáltató bekötése után).
 */
export default function SutiSzabalyzatPage() {
  return (
    <LegalPage
      title="Süti (cookie) szabályzat"
      intro="Ez a szabályzat bemutatja, milyen sütiket használ a weboldal és milyen célból."
      lastUpdated="2026. július"
    >

      <h2>1. Mi az a süti?</h2>
      <p>
        A süti (cookie) egy kis adatfájl, amelyet a weboldal a látogató eszközén helyez el.
        A sütik segítenek a weboldal megfelelő működésében és a látogatói élmény javításában.
      </p>

      <h2>2. Az általunk használt sütik</h2>
      <h3>Feltétlenül szükséges sütik</h3>
      <p>
        Ezek a weboldal alapvető működéséhez szükségesek (pl. a süti-hozzájárulás
        eltárolása). Ezek nélkül a weboldal nem működik megfelelően.
      </p>
      <ul>
        <li>
          <strong>holiday-cookie-consent</strong> – a süti-hozzájárulási döntést tárolja
          a böngészőben. Érvényesség: a látogató által törölhető.
        </li>
      </ul>

      <h3>Statisztikai / mérő sütik</h3>
      <p>
        Ezek a látogatottság méréséhez használatosak, és csak a látogató hozzájárulásával
        aktiválódnak. <span className="legal-todo">[a mérőszolgáltató és sütijeinek megnevezése – pl. Google Analytics, ha bekötésre kerül]</span>
      </p>

      <h2>3. A sütik kezelése</h2>
      <p>
        A süti-hozzájárulás bármikor visszavonható a böngésző beállításain keresztül, ahol a
        korábban eltárolt sütik törölhetők is. A böngésző beállításaiban a sütik használata
        letiltható, ez azonban befolyásolhatja a weboldal működését.
      </p>

      <h2>4. További információ</h2>
      <p>
        A személyes adatok kezeléséről bővebben az{" "}
        <a href="/adatkezeles">adatkezelési tájékoztatóban</a> olvashat.
      </p>

      <p className="legal-todo">
        Ez a szöveg tájékoztató jellegű sablon, és nem minősül jogi tanácsadásnak.
      </p>
    </LegalPage>
  );
}
