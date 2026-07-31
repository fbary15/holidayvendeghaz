import { Resend } from "resend";
import { CONTACT } from "@/lib/site";

/**
 * Központi e-mail küldés (Resend). Minden kimenő levél ezen megy keresztül,
 * hogy a feladó/címzett és a hibakezelés egy helyen legyen.
 *
 * Környezeti változók:
 *   RESEND_API_KEY     – Resend API kulcs (élesben kötelező)
 *   CONTACT_RECIPIENT  – a tulajdonos címe (alapértelmezés: CONTACT.email)
 *   CONTACT_FROM       – feladó; a domainnek igazoltnak kell lennie a Resendben
 *
 * Kulcs nélkül fejlesztői módban csak naplózunk (a hívó `true`-t kap),
 * élesben `false`-t adunk vissza.
 */

export const OWNER_EMAIL = process.env.CONTACT_RECIPIENT ?? CONTACT.email;
export const MAIL_FROM =
  process.env.CONTACT_FROM ?? "Holiday Vendégház <urlap@holidayvendeghaz.hu>";

export type Mail = {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendMail(mail: Mail, tag = "mailer"): Promise<boolean> {
  const to = mail.to ?? OWNER_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${tag}] RESEND_API_KEY hiányzik – az e-mail csak naplózva:`, {
        to,
        ...mail,
      });
      return true;
    }
    console.error(`[${tag}] RESEND_API_KEY hiányzik élesben – az e-mail NEM ment ki.`);
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    });
    if (error) {
      console.error(`[${tag}] Resend hiba:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[${tag}] küldés sikertelen:`, err);
    return false;
  }
}

/** Sortörések kiszedése, hogy a tárgymezőn át ne lehessen fejlécet becsempészni. */
export function safeSubjectPart(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
