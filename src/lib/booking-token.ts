import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A tulajdonosnak küldött jóváhagyó/elutasító linkek aláírása.
 * Így a döntési végpontot csak az tudja használni, aki megkapta a levelet.
 *
 * Környezeti változó: BOOKING_SECRET (élesben kötelező, hosszú véletlen string).
 */

export type Decision = "elfogad" | "elutasit";

export function isDecision(value: unknown): value is Decision {
  return value === "elfogad" || value === "elutasit";
}

function secret(): string {
  const s = process.env.BOOKING_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    console.warn("[booking-token] BOOKING_SECRET hiányzik – fejlesztői kulcs használatban.");
    return "dev-only-insecure-secret";
  }
  throw new Error("A BOOKING_SECRET környezeti változó nincs beállítva.");
}

export function signDecision(eventId: string, decision: Decision): string {
  return createHmac("sha256", secret()).update(`${eventId}.${decision}`).digest("hex").slice(0, 32);
}

export function verifyDecision(eventId: string, decision: Decision, token: string): boolean {
  const expected = signDecision(eventId, decision);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token ?? "", "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
