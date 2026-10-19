"use client";

import { motion } from "motion/react";
import { Kicker } from "@/components/ui/Kicker";
import { answerOptions } from "@/data/politicians";
import { answerFor, type AnswerId, type Quote } from "@/data/types";
import type { Answer } from "@/game/reducer";
import type { Tally } from "@/game/summary";
import { cn } from "@/lib/cn";

type BreakdownProps = {
  quotes: Quote[];
  answers: Answer[];
  byAnswer: Record<AnswerId, Tally>;
};

const badgeClasses: Record<AnswerId, string> = {
  lula: "bg-ink text-paper",
  bolsonaro: "bg-paper-2 text-ink",
  ambos: "border-dashed border-accent bg-paper text-lg",
};

export function Breakdown({ quotes, answers, byAnswer }: BreakdownProps) {
  const hits = hitsByAnswer({ quotes, answers });

  return (
    <section className="flex flex-col gap-2">
      <Kicker>Por suspeito</Kicker>
      <ul className="flex flex-col">
        {answerOptions.map((option, row) => (
          <li
            key={option.id}
            className="grid grid-cols-[36px_1fr_auto] items-center gap-2.5 border-b border-dotted border-ink py-1.5 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-9 items-center justify-center border-2 border-ink font-display text-base leading-none",
                badgeClasses[option.id],
              )}
            >
              {option.initials}
            </span>

            <span className="flex flex-col gap-1">
              <span className="font-display text-[15px] leading-none tracking-[0.04em] uppercase">{option.name}</span>
              <span className="flex gap-[3px]" aria-hidden="true">
                {hits[option.id].map((hit, i) => (
                  <motion.i
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2 + row * 0.15 + i * 0.08, duration: 0.35, ease: "backOut" }}
                    className={cn(
                      "block h-[7px] w-[22px] origin-left border-[1.5px]",
                      hit ? "border-accent bg-accent" : "border-ink bg-ink",
                    )}
                  />
                ))}
              </span>
            </span>

            <span className="min-w-12 text-right font-display text-[22px] leading-none">
              {byAnswer[option.id].correct}/{byAnswer[option.id].total}
              <small className="mt-0.5 block font-body text-[10px] leading-none font-normal text-mute italic">
                {verdictFor(byAnswer[option.id])}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Hit/miss sequence per answer, in the order the quotes were played */
function hitsByAnswer({ quotes, answers }: Pick<BreakdownProps, "quotes" | "answers">) {
  const quoteById = new Map(quotes.map((quote) => [quote.id, quote]));
  const hits: Record<AnswerId, boolean[]> = { lula: [], bolsonaro: [], ambos: [] };

  for (const answer of answers) {
    const quote = quoteById.get(answer.quoteId);

    if (quote) {
      hits[answerFor(quote.politician)].push(answer.correct);
    }
  }

  return hits;
}

function verdictFor({ correct, total }: Tally) {
  if (total === 0) {
    return "não apareceu";
  }

  if (correct === total) {
    return "conhece bem";
  }

  if (correct === 0) {
    return "nem viu";
  }

  return correct * 2 >= total ? "quase" : "chutou";
}
