"use client";

import { MotionConfig } from "motion/react";
import { useCallback } from "react";
import { answerOptions } from "@/data/politicians";
import { answerFor } from "@/data/types";
import { useGame } from "@/game/useGame";
import { useKeyboardShortcuts } from "@/game/useKeyboardShortcuts";
import { vibrate } from "@/lib/haptics";
import { Results } from "./Results";
import { Round } from "./Round";
import { RoundSkeleton } from "./RoundSkeleton";

const answerShortcuts = answerOptions.map((option) => option.shortcut);

export function Game() {
  const { state, currentQuote, lastAnswer, summary, answer, next, restart } = useGame();

  const handleAnswer = useCallback(
    (index: number) => {
      const option = answerOptions[index];

      if (state.phase !== "playing" || !option || !currentQuote) {
        return;
      }

      vibrate(option.id === answerFor(currentQuote.politician) ? 30 : [40, 30, 40]);
      answer(option.id);
    },
    [answer, currentQuote, state.phase],
  );

  // Enter/Space only belong to the game while there is something to advance; otherwise the page keeps them
  useKeyboardShortcuts({
    selectKeys: answerShortcuts,
    onSelect: handleAnswer,
    onAdvance: state.phase === "revealed" ? next : undefined,
  });

  return (
    <MotionConfig reducedMotion="user">
      {state.phase === "idle" && <RoundSkeleton />}

      {(state.phase === "playing" || state.phase === "revealed") && currentQuote && (
        <Round
          quote={currentQuote}
          index={state.index}
          total={state.quotes.length}
          score={state.score}
          streak={state.streak}
          answers={state.answers}
          lastAnswer={state.phase === "revealed" ? lastAnswer : null}
          onAnswer={handleAnswer}
          onNext={next}
        />
      )}

      {state.phase === "finished" && summary && (
        <Results summary={summary} quotes={state.quotes} answers={state.answers} onRestart={restart} />
      )}
    </MotionConfig>
  );
}
