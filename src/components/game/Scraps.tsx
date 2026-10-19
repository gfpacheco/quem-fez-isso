"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

const scrapCount = 34;
const scrapColors = ["var(--color-accent)", "var(--color-ink)", "var(--color-paper-2)", "var(--color-accent)", "var(--color-accent-2)"];
const scrapWords = ["EXTRA", "FEZ", "ERROU", "Nº 1", "R$0", "ACERTOU", "PÁG. 4"];

/** Paper-scrap confetti raining over the front page */
export function Scraps() {
  const [scraps] = useState(buildScraps);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {scraps.map((scrap, i) => (
        <span
          key={i}
          style={scrap.style}
          className={cn(
            "fall absolute -top-8 opacity-0",
            scrap.word !== null && "overflow-hidden border border-ink bg-paper-2 px-0.5 font-type text-[6px] leading-[1.1] text-ink",
          )}
        >
          {scrap.word}
        </span>
      ))}
    </div>
  );
}

function buildScraps() {
  return Array.from({ length: scrapCount }, (_, i) => {
    const isText = i % 5 === 0;

    return {
      word: isText ? scrapWords[(i / 5) % scrapWords.length] : null,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${isText ? 34 : 6 + Math.random() * 10}px`,
        height: `${isText ? 14 : 10 + Math.random() * 16}px`,
        background: isText ? undefined : scrapColors[i % scrapColors.length],
        "--fall-duration": `${4.5 + Math.random() * 4}s`,
        "--fall-delay": `${1.2 + Math.random() * 6}s`,
        "--fall-spin": `${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540)}deg`,
      } as CSSProperties,
    };
  });
}
