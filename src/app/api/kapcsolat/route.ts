import { Resend } from "resend";
import { LIMITS } from "@/lib/contact";
import { CONTACT } from "@/lib/site";

/**
 * Kapcsolati űrlap + vendégvélemény beküldése e-mailben.
 *
 * Szükséges környezeti változók (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     – a Resend API kulcs (kötelező élesben)
 *   CONTACT_RECIPIENT  – címzett (alapértelmezés: a site.ts-beli CONTACT.email)
 *   CONTACT_FROM       – feladó; a domainnek igazoltnak kell lennie a Resendben
 */
const RECIPIENT = process.env.CONTACT_RECIPIENT ?? CONTACT.email;
const FROM =
  process.env.CONTACT_FROM ?? "Holiday Vendégház <urlap@holidayvendeghaz.hu>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort korlátozás: az állapot példányonként él (hidegindításkor nullázódik,
// és nem közös a példányok között) — udvariassági fék a spam ellen, nem
// biztonsági határ.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const blocked = recent.length >= MAX_PER_WINDOW;
  if (!blocked) recent.push(now);
  hits.set(ip, recent);
  return blocked;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

type Mail = { subject: string; text: string; replyTo?: string };

function buildMail(body: Record<string, unknown>): Mail | null {
  const name = str(body.name);
  if (!name || name.length > LIMITS.name) return null;
  // A sortöréseket kiszedjük, hogy a tárgymezőn keresztül ne lehessen extra
  // levélfejlécet becsempészni.
  const safeName = name.replace(/[\r\n]+/g, " ");

  const message = str(body.message);
  if (!message || message.length > LIMITS.message) return null;

  if (body.type === "kapcsolat") {
    const email = str(body.email);
    if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) return null;
    return {
      subject: `Új üzenet a weboldalról – ${safeName}`,
      text: `Név: ${name}\nE-mail: ${email}\n\n${message}`,
      replyTo: email,
    };
  }

  if (body.type === "velemeny") {
    // A vélemény űrlapon az e-mail nem kötelező; ha megadták, legyen érvényes.
    const email = str(body.email);
    if (email && (email.length > LIMITS.email || !EMAIL_RE.test(email))) return null;
    return {
      subject: `Új vendégvélemény – ${safeName}`,
      text: `Név: ${name}\nE-mail: ${email || "(nem adta meg)"}\n\n${message}`,
      ...(email ? { replyTo: email } : {}),
    };
  }

  return null;
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 20_000) {
    return Response.json({ error: "A kérés túl nagy." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (typeof body !== "object" || body === null) throw new Error("not an object");
  } catch {
    return Response.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  // Kitöltött honeypot → sikert színlelünk, hogy a botok ne tanuljanak belőle.
  if (str(body.company) !== "") {
    return Response.json({ ok: true });
  }

  const mail = buildMail(body);
  if (!mail) {
    return Response.json({ error: "Kérjük, ellenőrizze a megadott adatokat." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return Response.json(
      { error: "Túl sok beküldés. Kérjük, próbálja meg később." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[api/kapcsolat] Hiányzik a RESEND_API_KEY – az e-mail csak naplózva:", mail);
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: "Az e-mail küldés jelenleg nem elérhető." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    });
    if (error) {
      console.error("[api/kapcsolat] Resend hiba:", error);
      return Response.json({ error: "Az e-mailt nem sikerült elküldeni." }, { status: 502 });
    }
  } catch (err) {
    console.error("[api/kapcsolat] küldés sikertelen:", err);
    return Response.json({ error: "Az e-mailt nem sikerült elküldeni." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
