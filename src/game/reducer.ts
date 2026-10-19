import { answerFor, type AnswerId, type Quote } from "@/data/types";
import { pointsForAnswer } from "./scoring";

export type GamePhase = "idle" | "playing" | "revealed" | "finished";

export type Answer = {
  quoteId: string;
  guess: AnswerId;
  correct: boolean;
  points: number;
};

export type GameState = {
  phase: GamePhase;
  quotes: Quote[];
  index: number;
  answers: Answer[];
  score: number;
  streak: number;
  bestStreak: number;
};

export type GameAction =
  | { type: "start"; quotes: Quote[] }
  | { type: "answer"; answerId: AnswerId }
  | { type: "next" }
  | { type: "restart" };

export const initialGameState: GameState = {
  phase: "idle",
  quotes: [],
  index: 0,
  answers: [],
  score: 0,
  streak: 0,
  bestStreak: 0,
};

export function gameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "start":
      return { ...initialGameState, phase: "playing", quotes: action.quotes } satisfies GameState;
    case "answer":
      return state.phase === "playing" ? applyAnswer(state, action.answerId) : state;
    case "next":
      return state.phase === "revealed" ? advance(state) : state;
    case "restart":
      return initialGameState;
  }
}

function applyAnswer(state: GameState, guess: AnswerId) {
  const quote = state.quotes[state.index];
  const actual = answerFor(quote.politician);
  const correct = actual === guess;
  const streak = correct ? state.streak + 1 : 0;
  const points = pointsForAnswer({ correct, actual, streak });

  return {
    ...state,
    phase: "revealed",
    answers: [...state.answers, { quoteId: quote.id, guess, correct, points }],
    score: state.score + points,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
  } satisfies GameState;
}

function advance(state: GameState) {
  const nextIndex = state.index + 1;

  if (nextIndex >= state.quotes.length) {
    return { ...state, phase: "finished" } satisfies GameState;
  }

  return { ...state, phase: "playing", index: nextIndex } satisfies GameState;
}
