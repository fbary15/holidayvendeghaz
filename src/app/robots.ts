import type { MetadataRoute } from "next";
import { SITE_URL, SITE_INDEXABLE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Amíg az oldal nincs élesítve (SITE_INDEXABLE), mindent tiltunk – így a
  // véleményezésre kiküldött verzió nem kerül be a keresőkbe, és később nem
  // versenyez duplikált tartalomként az éles domainnel.
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
