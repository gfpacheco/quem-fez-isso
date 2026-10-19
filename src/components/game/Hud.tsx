"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { Answer } from "@/game/reducer";
import { cn } from "@/lib/cn";

type HudProps = {
  index: number;
  total: number;
  score: number;
  answers: Answer[];
};

export function Hud({ index, total, score, answers }: HudProps) {
  return (
    <header className="grid grid-cols-[1fr_auto] items-end gap-2.5 border-b-[3px] border-ink pb-2.5">
      <div className="flex flex-col gap-1.5">
        <p className="font-label text-[10px] leading-none font-medium tracking-[0.26em] uppercase">
          Pergunta <b className="text-xs font-bold">{index + 1}</b> de {total}
        </p>
        <ol
          aria-label="Progresso da rodada"
          className="flex gap-1"
        >
          {Array.from({ length: total }, (_, i) => (
            <li
              key={i}
              aria-current={i === index ? "step" : undefined}
              className={cn("h-2.5 w-[18px] border-[1.5px] border-ink", tickClass(i, index, answers[i]))}
            />
          ))}
        </ol>
      </div>

      <p className="text-right font-label text-[10px] leading-none font-medium tracking-[0.26em] uppercase">
        Placar
        <AnimatedNumber value={score} className="mt-1 block font-display text-[34px] leading-[0.9] tracking-normal" />
      </p>
    </header>
  );
}

function tickClass(i: number, index: number, answer: Answer | undefined) {
  if (answer) {
    return answer.correct ? "border-accent bg-accent" : "bg-ink";
  }

  return i === index ? "animate-tick-pulse" : "";
}
