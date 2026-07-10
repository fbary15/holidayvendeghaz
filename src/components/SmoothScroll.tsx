"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lágy (momentum) görgetés a Lenis segítségével. A gyökér elrendezésbe kerül.
 *
 * - Tiszteletben tartja a `prefers-reduced-motion` beállítást (ilyenkor natív marad).
 * - Az oldalon belüli horgony-linkeket (#szakasz) lágyan görgeti, a fix fejléc
 *   miatt −80px eltolással.
 * - A teljes képernyős overlay (lightbox) idejére felfüggeszti a görgetést
 *   (az `app:overlay` esemény alapján).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Lágy horgony-navigáció (fix fejléc miatt eltolással).
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname) return; // másik oldal → sima navigáció
      const hash = url.hash;
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      window.history.pushState(null, "", hash);
    }
    document.addEventListener("click", onClick);

    // A lightbox (vagy más teljes képernyős overlay) idejére állítsuk le a Lenist.
    function onOverlay(e: Event) {
      const open = (e as CustomEvent).detail?.open;
      if (open) lenis.stop();
      else lenis.start();
    }
    window.addEventListener("app:overlay", onOverlay as EventListener);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onClick);
      window.removeEventListener("app:overlay", onOverlay as EventListener);
      lenis.destroy();
    };
  }, []);

  return null;
}
