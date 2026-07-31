/**
 * Közös „szerződés” az űrlapok (ContactSection, FeedbackSection) és az
 * /api/kapcsolat route között, hogy a kliensoldali `maxLength` és a
 * szerveroldali ellenőrzés ne csúszhasson szét.
 */
export const LIMITS = {
  name: 200,
  email: 254,
  message: 5000,
} as const;

/** A `company` mező honeypot: ember számára rejtett, a botok kitöltik. */
export type ContactPayload =
  | {
      type: "kapcsolat";
      name: string;
      email: string;
      message: string;
      company?: string;
    }
  | {
      type: "velemeny";
      name: string;
      /** Opcionális – ha megadja, a tulajdonos tud rá válaszolni. */
      email?: string;
      message: string;
      company?: string;
    };

export type FormStatus = "idle" | "sending" | "success" | "error";

/** Beküldi az űrlapot az API-nak. `true`, ha sikerült. */
export async function submitContactForm(payload: ContactPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/kapcsolat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
