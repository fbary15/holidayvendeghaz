import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Csak az indexelhető oldalakat hirdetjük. A jogi aloldalak (adatkezeles,
  // suti-szabalyzat, aszf) szándékosan `noindex`-esek, ezért nem szerepelnek itt.
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/galeria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
