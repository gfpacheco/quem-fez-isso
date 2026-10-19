"use client";

import { Kicker } from "@/components/ui/Kicker";
import type { Quote } from "@/data/types";
import type { Answer } from "@/game/reducer";
import { riseAt } from "@/lib/rise";
import { Clipping } from "./Clipping";
import { Hud } from "./Hud";
import { Lineup } from "./Lineup";
import { Reveal, revealAnnouncement } from "./Reveal";
import { Streak } from "./Streak";

type RoundProps = {
  quote: Quote;
  index: number;
  total: number;
  score: number;
  streak: number;
  answers: Answer[];
  /** Present only after the current question was answered */
  lastAnswer: Answer | null;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
};

export function Round({ quote, index, total, score, streak, answers, lastAnswer, onAnswer, onNext }: RoundProps) {
  const status = lastAnswer === null ? "pending" : lastAnswer.correct ? "correct" : "wrong";
  const broken = status === "wrong" ? trailingHits(answers.slice(0, -1)) : 0;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <Hud index={index} total={total} score={score} answers={answers} />

      {/* Lives outside the keyed subtree so it is already mounted when the verdict text lands */}
      <p aria-live="assertive" className="sr-only">
        {lastAnswer && revealAnnouncement(quote, lastAnswer)}
      </p>

      {/* Keyed by quote so every question re-runs the staggered entrance */}
      <div key={quote.id} className="flex flex-1 flex-col gap-5">
        <Streak streak={streak} broken={broken} />

        <div style={riseAt(0.3)} className="rise">
          <Clipping quote={quote} page={index + 1} status={status} />
        </div>

        <Kicker style={riseAt(0.5)} className="rise mt-2">
          {lastAnswer ? "O culpado" : "Quem fez isso?"}
        </Kicker>

        <div style={riseAt(0.6)} className="rise">
          <Lineup quote={quote} guess={lastAnswer?.guess ?? null} onAnswer={onAnswer} />
        </div>

        {lastAnswer ? (
          <Reveal quote={quote} answer={lastAnswer} isLast={index + 1 === total} onNext={onNext} />
        ) : (
          <p style={riseAt(0.9)} className="rise text-center font-body text-[13px] font-medium text-mute italic">
            Toque no suspeito. Sem voltar atrás.
          </p>
        )}
      </div>
    </div>
  );
}

function trailingHits(answers: Answer[]) {
  let count = 0;

  for (let i = answers.length - 1; i >= 0 && answers[i].correct; i--) {
    count += 1;
  }

  return count;
}
