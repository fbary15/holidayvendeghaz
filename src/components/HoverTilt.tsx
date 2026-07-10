"use client";

import { useRef, type ReactNode } from "react";

/**
 * Finom, egeret követő 3D „tilt” effekt a képekhez. A kurzor pozíciója alapján
 * enyhén megdönti a kártyát, és egy lágy fényfoltot (glare) mozgat a kép fölött.
 * A mozgás CSS-tranzícióval simított (lassan „utánakúszik” a kurzornak), és
 * tiszteletben tartja a `prefers-reduced-motion` beállítást.
 *
 * A hívó a `className`-ben adja meg a méretet/lekerekítést/`overflow-hidden`-t,
 * és tegyen rá `group`-ot, ha a gyerekelemek `group-hover`-t használnak.
 */
export default function HoverTilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  /** A tilt-kártya osztályai (méret, `relative`, `rounded-*`, `overflow-hidden`, `group`). */
  className?: string;
  /** Maximális dőlésszög fokban. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", ((px - 0.5) * max * 2).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * max * 2).toFixed(2) + "deg");
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`tilt-card ${className}`}
    >
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
}
