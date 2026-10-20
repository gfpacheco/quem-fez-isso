"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Kicker } from "@/components/ui/Kicker";
import { authorName } from "@/data/politicians";
import { bothSidesId, type Quote } from "@/data/types";
import type { Answer } from "@/game/reducer";
import { riseAt } from "@/lib/rise";

type RevealProps = {
  quote: Quote;
  answer: Answer;
  isLast: boolean;
  onNext: () => void;
};

export function Reveal({ quote, answer, isLast, onNext }: RevealProps) {
  const nextRef = useRef<HTMLButtonElement>(null);

  // Focus the only action left without scrolling the stamp off-screen
  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 style={riseAt(0.9)} className="rise border-t-[3px] border-b border-ink py-2.5 font-display text-2xl leading-none tracking-[0.02em] uppercase">
        {answer.correct ? (
          <>
            <span className="text-success">Acertou</span> +{answer.points} pts
          </>
        ) : (
          <>
            <span className="text-danger">Errou</span> <span className="text-mute">·</span> <span className="text-accent">{culpritLabel(quote)}</span>
          </>
        )}
      </h2>

      <Button ref={nextRef} variant="accent" size="lg" onClick={onNext} style={riseAt(1.0)} className="rise w-full justify-between">
        <span>{isLast ? "Ver resultado" : "Próxima"}</span>
        <span className="flex items-center gap-3">
          <Kbd className="border-paper/40 text-paper/80">↵</Kbd>
          <span aria-hidden="true" className="text-[26px]">→</span>
        </span>
      </Button>

      <div style={riseAt(1.1)} className="rise">
        <Kicker align="left">O contexto</Kicker>
        <p className="drop-cap mt-2 font-body text-[15px] leading-snug">{quote.context}</p>

        <ul className="mt-2.5 flex flex-col gap-1 font-type text-[11px] leading-snug text-ink-2">
          {quote.sources.map((source) => (
            <li key={source.url} className="flex gap-2">
              <span className="shrink-0 uppercase">Fonte</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 border-b-[1.5px] border-accent font-bold text-accent"
              >
                {source.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Plain-text verdict for the live region that announces the reveal to screen readers */
export function revealAnnouncement(quote: Quote, answer: Answer) {
  return answer.correct ? `Acertou, mais ${answer.points} pontos` : `Errou, ${culpritLabel(quote)}`;
}

function culpritLabel(quote: Quote) {
  return quote.politician === bothSidesId ? "foram os dois lados" : `foi ${authorName(quote.politician)}`;
}
