import Image from "next/image";
import type { Photo } from "@/lib/photos";

/**
 * A valódi fotókat megjelenítő komponens (next/image alapon).
 *
 * A képek a `public/images/gallery/` mappában, optimalizált JPEG formában
 * élnek; a next/image ebből reszponzív, modern (WebP/AVIF) változatokat szolgál
 * ki. Minden képhez tartozik egy pici, base64 „blur” előnézet (elmosott
 * helykitöltő), így a betöltés kellemes, ugrásmentes.
 *
 * A szülő elemnek `relative` (pozicionált) és rögzített méretűnek kell lennie,
 * mert a kép `fill` módban tölti ki azt.
 */
export default function PhotoImage({
  photo,
  sizes,
  priority = false,
  contain = false,
  className = "",
}: {
  photo: Photo;
  /** A next/image `sizes` attribútuma – a reszponzív kiszolgáláshoz. */
  sizes: string;
  priority?: boolean;
  /** `true` esetén object-contain (pl. lightbox), egyébként object-cover. */
  contain?: boolean;
  className?: string;
}) {
  const blurProps = photo.blur
    ? ({ placeholder: "blur", blurDataURL: photo.blur } as const)
    : ({ placeholder: "empty" } as const);

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      {...blurProps}
      className={`${contain ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
