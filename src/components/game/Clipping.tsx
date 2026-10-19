"use client";

import { motion } from "motion/react";
import { Stamp } from "@/components/ui/Stamp";
import type { Quote } from "@/data/types";
import { cn } from "@/lib/cn";

export type ClippingStatus = "pending" | "correct" | "wrong";

type ClippingProps = {
  quote: Quote;
  page: number;
  status: ClippingStatus;
};

const shake = { x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] };

/** Torn newspaper clipping carrying the anonymous deed */
export function Clipping({ quote, page, status }: ClippingProps) {
  return (
    <motion.figure
      animate={status === "wrong" ? shake : { x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
      className="relative -rotate-[1.4deg] drop-shadow-[4px_5px_0_rgba(21,17,13,0.9)]"
    >
      <div className="torn relative bg-paper-2 px-4.5 pt-5 pb-4">
        <span aria-hidden="true" className="halftone text-ink opacity-[0.08]" />

        <div className="mb-3 flex items-center justify-between">
          <span className="border-2 border-ink bg-ink px-2.5 pt-1.5 pb-1 font-label text-[11px] leading-none font-bold tracking-[0.28em] text-paper uppercase">
            Atitude
          </span>
          <span className="font-type text-[11px] leading-none text-ink-2">Pág. {page}</span>
        </div>

        <blockquote
          className={cn(
            "relative pl-1 font-display leading-none tracking-[0.005em] text-balance uppercase before:absolute before:-top-5 before:-left-3.5 before:font-body before:text-[110px] before:leading-none before:font-bold before:text-accent/90 before:content-['“']",
            quoteSizeClass(quote.text),
          )}
        >
          {quote.text}
        </blockquote>

        <p className="mt-3.5 border-t border-dashed border-ink pt-2 font-type text-xs leading-relaxed text-ink-2">
          {status === "pending" ? (
            <>
              Fonte: <Redacted width="w-28" />, <Redacted width="w-10" /> — revelada após a resposta.
            </>
          ) : (
            <>Fonte: revelada abaixo · {quote.year}.</>
          )}
        </p>
      </div>

      {status === "correct" && (
        <Stamp color="accent" rotate={-14} delay={0.35} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[54px]">
          Acertou
        </Stamp>
      )}

      {status === "wrong" && (
        <Stamp color="ink" rotate={-14} delay={0.35} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[54px]">
          Errou
        </Stamp>
      )}
    </motion.figure>
  );
}

function Redacted({ width }: { width: string }) {
  return <span aria-hidden="true" className={cn("inline-block h-3 translate-y-0.5 bg-ink", width)} />;
}

/** Long deeds shrink so the clipping never pushes the line-up below the fold */
function quoteSizeClass(text: string) {
  if (text.length <= 70) {
    return "text-[31px]";
  }

  if (text.length <= 130) {
    return "text-2xl";
  }

  return "text-xl";
}
