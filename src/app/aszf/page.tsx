import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT, PRICING, BOOKING_FLOW, formatFt } from "@/lib/site";
import { BOOKING_LIMITS, formatHuDate } from "@/lib/booking";

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
        A feltüntetett árak a teljes nyaralóra, éjszakánként értendők. A minimum foglalható
        időszak {PRICING.minNights} éjszaka.
      </p>
      <ul>
        {PRICING.seasons.map((s) => (
          <li key={s.id}>
            <strong>{s.label}</strong> ({s.period}, az ünnepnapok kivételével):{" "}
            {formatFt(s.pricePerNight)} / éj
          </li>
        ))}
        <li>
          <strong>Ünnepnapok:</strong> kizárólag csomagban, főszezoni áron (
          {formatFt(PRICING.holidayPricePerNight)} / éj) foglalhatók:{" "}
          {PRICING.holidayPackages
            .map((p) => `${p.label} (${formatHuDate(p.from)} – ${formatHuDate(p.to)})`)
            .join("; ")}
          .
        </li>
        <li>
          <strong>Háziállat:</strong> legfeljebb {PRICING.pets.max} hozható,{" "}
          {formatFt(PRICING.pets.feePerNight)} / éjszaka felár ellenében.
        </li>
        {PRICING.conditions.map((c) => (
          <li key={c.slice(0, 24)}>{c}</li>
        ))}
      </ul>
      <p>
        Az ár tartalmazza {PRICING.includes.join(" és ")}. Az ár <strong>nem</strong> tartalmazza{" "}
        {PRICING.excludes.join(", ")}, amely a helyszínen fizetendő.
      </p>
      <p>
        {PRICING.validityNote} Az <strong>első részlet a foglalás teljes összegének{" "}
        {PRICING.depositPercent}%-a</strong>, amelyről a szolgáltató a foglalási igény
        beérkezésének napján előlegszámlát állít ki, és azt e-mailben megküldi. A foglalás
        az előleg banki átutalással történő megfizetésével és a szolgáltató írásbeli
        visszaigazolásával válik véglegessé.
      </p>
      <p>
        A foglalót a visszaigazolástól számított {BOOKING_FLOW.depositDays} napon belül kell
        banki átutalással megfizetni. A fennmaradó összeget a vendég a helyszínen, az
        érkezéskor rendezi a tulajdonossal.
      </p>

      <h2>5. Lemondási feltételek</h2>
      <p>
        A foglalás <strong>az érkezés napját megelőző {BOOKING_FLOW.freeCancelDays}. napig
        díjmentesen lemondható</strong>; ebben az esetben a befizetett foglalót
        visszatérítjük.
      </p>
      <p>
        Az érkezést megelőző {BOOKING_FLOW.freeCancelDays} napon belüli lemondás esetén a
        befizetett foglaló összege a szolgáltatót illeti. A fennmaradó összeg ilyenkor sem
        kerül kiszámlázásra.
      </p>
      <p>
        Módosítási igényét kérjük, mielőbb jelezze a fenti elérhetőségek valamelyikén; a
        módosítás lehetőségéről a szabad kapacitás függvényében tudunk nyilatkozni.
      </p>

      <h2>6. Érkezés és távozás</h2>
      <p>
        Érkezés az érkezés napján <strong>{BOOKING_FLOW.checkInFrom} órától</strong>, távozás
        a távozás napján <strong>{BOOKING_FLOW.checkOutBy} óráig</strong>.
      </p>
      <p>
        Kérjük, érkezés előtt körülbelül {BOOKING_FLOW.callBeforeHours} órával jelezze
        telefonon az érkezését a{" "}
        <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a> számon, hogy a szálláshely
        átadása zökkenőmentes legyen.
      </p>

      <h2>7. Házirend</h2>
      <p>
        A szálláshely legfeljebb <strong>{BOOKING_LIMITS.maxGuests} fő</strong> részére vehető
        igénybe. Háziállat legfeljebb {PRICING.pets.max} hozható, a 4. pontban meghatározott
        felár ellenében, előzetes jelzés alapján.
      </p>
      <p>
        A részletes házirendet a szálláshelyen, jól látható helyen kifüggesztve helyeztük el,
        és az érkezéskor átadás-átvételkor is ismertetjük. A vendég felelősséggel tartozik az
        általa vagy a vele érkezők által okozott károkért.
      </p>
      <p className="legal-todo">
        [Kiegészítendő, ha a Megbízó további, a foglalási döntést befolyásoló szabályt kíván
        közzétenni – pl. dohányzás, csendes pihenő ideje.]
      </p>

      <h2>8. Panaszkezelés és jogorvoslat</h2>
      <p>
        Esetleges panaszait a fenti elérhetőségeken jelezheti. A fogyasztói jogviták
        rendezéséhez a lakóhely szerint illetékes békéltető testülethez lehet fordulni.
      </p>

    </LegalPage>
  );
}
