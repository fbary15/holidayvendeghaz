"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Finom „scroll reveal” burkoló – az elem alulról úszik be, amikor a nézetbe ér.
 * Tiszteletben tartja a `prefers-reduced-motion` beállítást (a globals.css a
 * tranzíciókat is lerövidíti).
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
