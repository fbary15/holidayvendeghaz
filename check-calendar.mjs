// Ellenőrzi, hogy a "Foglalások" naptár meg van-e osztva a service accounttal,
// és van-e "Események módosítása" (írás) jog.
//
// Használat:
//   node check-calendar.mjs <a-letöltött-kulcs.json elérési útja>
//
// Kimenet:
//   ❌ 404            -> nincs megosztva
//   ✅ olvasás + ⚠️  -> meg van osztva, de csak olvasásra (rossz jog)
//   ✅ olvasás + írás -> minden rendben, mehet a bekötés

import { google } from "googleapis";
import { readFileSync } from "node:fs";

const KEY_PATH = process.argv[2];
const CALENDAR_ID =
  "e7df7b25440b2ba4b681538948ed4b13b9e1ae49767c28d4c0e3268426e0ca88@group.calendar.google.com";

if (!KEY_PATH) {
  console.error("Használat: node check-calendar.mjs <kulcs.json elérési útja>");
  process.exit(1);
}

const creds = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

console.log(`Service account: ${creds.client_email}`);
console.log(`Naptár:          ${CALENDAR_ID}\n`);

// 1) OLVASÁS – van-e egyáltalán hozzáférés (= megosztás)?
let cal;
try {
  cal = (await calendar.calendars.get({ calendarId: CALENDAR_ID })).data;
} catch (err) {
  const code = err?.code || err?.response?.status;
  if (code === 404) {
    console.log("❌ NINCS MEGOSZTVA — a service account nem látja a naptárat (404).");
    console.log("   Tibornak meg kell osztania a naptárat a fenti service account címmel.");
  } else if (code === 403) {
    console.log("⚠️  403 — a Google Calendar API valószínűleg nincs engedélyezve a projektben.");
    console.log("   Console → APIs & Services → Enable APIs → Google Calendar API.");
  } else {
    console.log("⚠️  Váratlan hiba:", code, err?.message);
  }
  process.exit(1);
}
console.log(`✅ MEGOSZTVA (olvasás OK) — naptár neve: „${cal.summary}", időzóna: ${cal.timeZone}`);

// 2) ÍRÁS – van-e „Események módosítása" jog? (teszt esemény létrehozása + azonnali törlése)
try {
  const ev = (
    await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary: "__TESZT – automatikusan törölve__",
        start: { date: "2035-01-01" },
        end: { date: "2035-01-02" },
      },
    })
  ).data;
  await calendar.events.delete({ calendarId: CALENDAR_ID, eventId: ev.id });
  console.log('✅ ÍRÁS OK — „Események módosítása" jog megvan (teszt esemény létrehozva, majd törölve).');
  console.log("\n🎉 Minden rendben: a naptár készen áll a bekötésre.");
} catch (err) {
  const code = err?.code || err?.response?.status;
  if (code === 403) {
    console.log('⚠️  CSAK OLVASÁS — meg van osztva, de NINCS „Események módosítása" jog.');
    console.log('   Kérd meg Tibort, hogy a megosztásnál a jogot állítsa „Események módosítása"-ra.');
  } else {
    console.log("⚠️  Írás teszt hiba:", code, err?.message);
  }
  process.exit(1);
}
