"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StampProps = {
  children: ReactNode;
  color?: "accent" | "ink";
  rotate?: number;
  delay?: number;
  className?: string;
};

const colorClasses = {
  accent: "text-accent",
  ink: "text-ink",
};

/** Rubber stamp slamming onto the page with an overshoot */
export function Stamp({ children, color = "accent", rotate = -12, delay = 0, className }: StampProps) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 3.2, rotate }}
      animate={{ opacity: [0, 1, 1, 1], scale: [3.2, 0.92, 1.05, 1], rotate }}
      transition={{ duration: 0.55, delay, times: [0, 0.55, 0.75, 1], ease: "easeOut" }}
      className={cn(
        "stamp-mask pointer-events-none absolute z-10 border-[5px] border-current px-3.5 pt-1 pb-0.5 font-display leading-none tracking-[0.06em] whitespace-nowrap uppercase mix-blend-multiply after:absolute after:inset-1 after:border-[1.5px] after:border-current",
        colorClasses[color],
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
