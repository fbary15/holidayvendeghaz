// Kilistázza az ÖSSZES naptárat, amit a service account lát, a Calendar ID-val
// és a jogosultsági szinttel együtt.
//
// ⚠️ FIGYELEM – ez a szkript ÜRES LISTÁT is adhat úgy, hogy a megosztás
// tökéletesen működik! A `calendarList` a felhasználó SAJÁT naptárlistája, és
// service accountnál ez NEM töltődik fel automatikusan attól, hogy megosztanak
// vele egy naptárat (a meghívót elfogadni nem tudja). 2026-07-30-án pontosan ez
// történt: itt 0 naptár látszott, miközben a check-calendar.mjs olvasásra és
// írásra is átment.
//
// Az MÉRVADÓ ellenőrzés tehát a `check-calendar.mjs`, ami a konkrét Calendar
// ID-t szólítja meg. Ez a szkript csak kiegészítés arra az esetre, ha a naptár
// mégis felkerült a listára.
//
// Használat:
//   node list-calendars.mjs <kulcs.json elérési útja>
//
// A kiírt `accessRole` jelentése:
//   owner  -> teljes jog
//   writer -> „Események módosítása" – EZ KELL a foglalási rendszerhez
//   reader -> csak olvasás, foglalást NEM tudunk beírni

import { google } from "googleapis";
import { readFileSync } from "node:fs";

const KEY_PATH = process.argv[2];

if (!KEY_PATH) {
  console.error("Használat: node list-calendars.mjs <kulcs.json elérési útja>");
  process.exit(1);
}

const creds = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

console.log(`Service account: ${creds.client_email}\n`);

const items = (await calendar.calendarList.list()).data.items ?? [];

if (items.length === 0) {
  console.log("A service account naptárlistája ÜRES.");
  console.log("⚠️  Ez NEM jelenti azt, hogy nincs megosztva! A calendarList");
  console.log("    service accountnál jellemzően akkor is üres marad, ha a");
  console.log("    megosztás rendben van. Ellenőrizd a check-calendar.mjs-sel:");
  console.log("      node check-calendar.mjs <kulcs.json>");
  process.exit(1);
}

console.log(`Látható naptárak: ${items.length}\n`);
for (const c of items) {
  const ok = c.accessRole === "writer" || c.accessRole === "owner";
  console.log(`${ok ? "✅" : "⚠️ "} „${c.summary}"  [${c.accessRole}]`);
  console.log(`   Calendar ID: ${c.id}`);
  if (!ok) {
    console.log('   ⚠️  Nincs írási jog – a megosztásnál „Események módosítása" kell.');
  }
  console.log();
}
