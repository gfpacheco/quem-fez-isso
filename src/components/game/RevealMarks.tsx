"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { SuspectState } from "./SuspectCard";

type MarkShape = "portrait" | "wide";

type MarkKind = "circle" | "x";

type RevealMarkProps = {
  state: SuspectState;
  /** Portrait for the file cards, wide for the joint-file bar */
  shape: MarkShape;
};

type RevealTagProps = {
  state: SuspectState;
  /** Red marker tag pinned to the card once revealed */
  tag: string | null;
  className?: string;
};

/** Marks and tags land together, right after the stamp hits the clipping */
const revealTransition = { delay: 0.75, duration: 0.2 };

const markKinds: Partial<Record<SuspectState, MarkKind>> = { truth: "circle", wrong: "x" };

const strokes: Record<MarkShape, { viewBox: string } & Record<MarkKind, ReactNode>> = {
  portrait: {
    viewBox: "0 0 100 130",
    circle: <ellipse cx="50" cy="62" rx="44" ry="56" strokeWidth="4" strokeDasharray="330 20" transform="rotate(-6 50 62)" />,
    x: <path d="M10 12 L90 118 M90 12 L10 118" strokeWidth="7" />,
  },
  wide: {
    viewBox: "0 0 100 40",
    circle: <ellipse cx="50" cy="20" rx="47" ry="16" strokeWidth="1.6" strokeDasharray="300 12" transform="rotate(-1.5 50 20)" />,
    x: <path d="M4 4 L96 36 M96 4 L4 36" strokeWidth="2.5" />,
  },
};

/** Red marker stroke drawn over a card: a circle for the culprit, an X for a bad bet */
export function RevealMark({ state, shape }: RevealMarkProps) {
  const kind = markKinds[state];

  if (!kind) {
    return null;
  }

  const { viewBox, ...paths } = strokes[shape];

  return (
    <motion.svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={revealTransition}
      className="pointer-events-none absolute inset-0 size-full stroke-accent"
      fill="none"
      strokeLinecap="round"
    >
      {paths[kind]}
    </motion.svg>
  );
}

export function RevealTag({ state, tag, className }: RevealTagProps) {
  if (!tag) {
    return null;
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={revealTransition}
      className={cn(
        "absolute px-2 pt-1 pb-0.5 font-label text-[10px] leading-none font-bold tracking-[0.22em] whitespace-nowrap text-paper uppercase",
        state === "wrong" ? "bg-ink" : "bg-accent",
        className,
      )}
    >
      {tag}
    </motion.span>
  );
}
