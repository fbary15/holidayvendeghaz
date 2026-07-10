# Holiday Vendégház – weboldal

Kód alapú, egyedi weboldal a **Holiday Vendégház** (Békésszentandrás) részére.
Prometheus Core alaprendszer – Next.js (App Router) + React + Tailwind CSS v4 +
framer-motion. Sötét, matt fekete + zöld arculat.

## Fejlesztés

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # éles build
npm start        # éles build futtatása
```

## Felépítés

```
src/
  app/
    layout.tsx            # gyökér layout, metaadatok, JSON-LD (LodgingBusiness)
    page.tsx             # Főoldal (Hero, Bemutatkozás, Szolgáltatások, Galéria, Foglalás, Kapcsolat)
    galeria/             # Galéria aloldal (lightbox)
    adatkezeles/         # Adatkezelési tájékoztató (sablon)
    suti-szabalyzat/     # Süti szabályzat (sablon)
    aszf/                # ÁSZF (sablon)
    opengraph-image.tsx  # dinamikus OG kép (matt fekete + zöld)
    robots.ts / sitemap.ts / manifest.ts
    error.tsx / not-found.tsx
  components/            # Navbar, Hero, About, Amenities, Booking, Contact, Gallery, Footer, ...
  lib/
    site.ts             # központi konfiguráció (SITE_URL, kapcsolat, NTAK, geo)
    photos.ts           # generált fotókatalógus (hero, bemutatkozás, galéria)
public/
  favicon.svg           # zöld ház jelkép
  images/logo.jpg       # az eredeti logó (referencia)
  images/gallery/       # a Megbízó valódi, optimalizált fotói
```

## Ez az „alap” (foundation) – teendők élesítés előtt

A szerződés szerint néhány elem tudatosan helykitöltő / bekötendő:

- **Szövegek:** ✅ **bekötve.** A Megbízó által biztosított végleges magyar
  szövegek (Hero, Bemutatkozás, Szolgáltatások, Galéria, Footer, meta/SEO) be
  vannak építve; a *lorem ipsum* helykitöltők eltávolítva. A foglalás/kapcsolat
  űrlapok visszajelző szövegei is véglegesek.
- **Fotók:** ✅ **bekötve.** A Megbízó által biztosított valódi fotók a
  `public/images/gallery/` mappában (optimalizált JPEG), a kiosztásukat a
  `src/lib/photos.ts` (generált) fájl írja le: hero háttérkép, bemutatkozó képek,
  főoldali galéria-előnézet és a teljes Galéria (`next/image`, blur előnézettel).
  A feliratok (alt/caption) szükség szerint finomíthatók.
- **Foglalási rendszer:** a naptár + űrlap a felhasználói felület alapja; az
  elérhetőség jelenleg példaadat (mock). Bekötendő a valós háttér: API route →
  **Google Naptár** + e-mail értesítések (szerződés III.).
- **Árak:** ⚠️ **helykitöltő.** A `PRICING` objektum (`src/lib/site.ts`,
  `placeholder: true`) miatt a foglalási szekcióban „Ár megadása hamarosan"
  jelenik meg. Kitöltés: add meg a `perNight` (és opcionálisan `deposit`)
  mezőt, majd állítsd a `placeholder` értékét `false`-ra.
- **Kapcsolati űrlap:** a beküldés még nem küld e-mailt – bekötendő az
  `/api/kapcsolat` route.
- **`SITE_URL`** (`src/lib/site.ts`): a végleges domainre állítandó.
- **Jogi oldalak** (Adatkezelés, Süti, ÁSZF): **sablonok**, a sárgával jelölt
  `[placeholder]` részek kitöltendők; ügyvédi felülvizsgálat javasolt (szerződés X.).
- **Beágyazott térkép:** a Kapcsolat szekcióba a valós térkép bekötendő.
- **Süti banner:** elfogadás esetén ide köthető be a mérő/analitikai szkript.

---
Készítette: **Prometheus Digital Kft.**
