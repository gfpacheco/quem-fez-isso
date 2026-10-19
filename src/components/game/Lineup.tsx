"use client";

import { answerOptions, politicians } from "@/data/politicians";
import { answerFor, bothSidesId, type AnswerId, type Quote } from "@/data/types";
import { BothSidesCard } from "./BothSidesCard";
import { SuspectCard, type SuspectState } from "./SuspectCard";

type LineupProps = {
  quote: Quote;
  /** The player's guess once answered, null while waiting */
  guess: AnswerId | null;
  onAnswer: (optionIndex: number) => void;
};

export function Lineup({ quote, guess, onAnswer }: LineupProps) {
  const actual = answerFor(quote.politician);
  const cards = answerOptions.map((option, index) => {
    const state: SuspectState = stateFor(option.id, actual, guess);

    return {
      option,
      shortcut: option.shortcut,
      state,
      tag: tagFor(state, quote, guess),
      onClick: () => onAnswer(index),
    };
  });
  const [lula, bolsonaro, both] = cards;

  return (
    <div role="group" aria-label="Quem fez isso?" className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <SuspectCard {...lula} />
        <SuspectCard {...bolsonaro} />
      </div>
      <BothSidesCard {...both} />
    </div>
  );
}

function stateFor(id: AnswerId, actual: AnswerId, guess: AnswerId | null) {
  if (guess === null) {
    return "idle";
  }

  if (id === actual) {
    return "truth";
  }

  return id === guess ? "wrong" : "dimmed";
}

function tagFor(state: SuspectState, quote: Quote, guess: AnswerId | null) {
  if (state === "wrong") {
    return "Sua aposta";
  }

  if (state !== "truth") {
    return null;
  }

  if (quote.politician === bothSidesId) {
    return guess === bothSidesId ? "Culpados" : "Foram eles";
  }

  if (quote.politician === "lula") {
    return guess === "lula" ? "Culpado" : "Foi ele";
  }

  return `Foi ${politicians[quote.politician].shortName}`;
}
