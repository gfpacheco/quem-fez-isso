import { describe, expect, it } from "vitest";
import { answerFor } from "@/data/types";
import { gameReducer, initialGameState, type GameState } from "./reducer";
import { makeQuote } from "./testUtils";

const quotes = [
  makeQuote("lula-001", "lula"),
  makeQuote("flavio-001", "flavio"),
  makeQuote("ambos-001", "ambos"),
];

function started() {
  return gameReducer(initialGameState, { type: "start", quotes });
}

describe("gameReducer", () => {
  it("starts in idle", () => {
    expect(initialGameState.phase).toBe("idle");
  });

  it("moves to playing on start", () => {
    const state = started();

    expect(state.phase).toBe("playing");
    expect(state.index).toBe(0);
    expect(state.quotes).toBe(quotes);
    expect(state.answers).toEqual([]);
    expect(state.score).toBe(0);
  });

  it("records a correct answer and reveals", () => {
    const state = gameReducer(started(), { type: "answer", answerId: "lula" });

    expect(state.phase).toBe("revealed");
    expect(state.answers).toEqual([
      { quoteId: "lula-001", guess: "lula", correct: true, points: 100 },
    ]);
    expect(state.score).toBe(100);
    expect(state.streak).toBe(1);
    expect(state.bestStreak).toBe(1);
  });

  it("records a wrong answer and breaks the streak", () => {
    const state = gameReducer(started(), { type: "answer", answerId: "bolsonaro" });

    expect(state.phase).toBe("revealed");
    expect(state.answers[0]).toMatchObject({ guess: "bolsonaro", correct: false, points: 0 });
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
  });

  it("accepts the Bolsonaro answer for either Jair or Flávio", () => {
    let state = started();
    state = gameReducer(state, { type: "answer", answerId: "lula" });
    state = gameReducer(state, { type: "next" });
    state = gameReducer(state, { type: "answer", answerId: "bolsonaro" });

    expect(state.answers[1]).toMatchObject({ quoteId: "flavio-001", correct: true });
  });

  it("applies streak bonus and both-sides base points", () => {
    let state = started();
    state = gameReducer(state, { type: "answer", answerId: "lula" });
    state = gameReducer(state, { type: "next" });
    state = gameReducer(state, { type: "answer", answerId: "bolsonaro" });
    state = gameReducer(state, { type: "next" });
    state = gameReducer(state, { type: "answer", answerId: "ambos" });

    expect(state.answers.map((a) => a.points)).toEqual([100, 125, 200]);
    expect(state.score).toBe(425);
    expect(state.bestStreak).toBe(3);
  });

  it("ignores answers outside the playing phase", () => {
    const revealed = gameReducer(started(), { type: "answer", answerId: "lula" });
    const again = gameReducer(revealed, { type: "answer", answerId: "bolsonaro" });

    expect(again).toBe(revealed);
    expect(gameReducer(initialGameState, { type: "answer", answerId: "bolsonaro" })).toBe(initialGameState);
  });

  it("ignores next outside the revealed phase", () => {
    const state = started();

    expect(gameReducer(state, { type: "next" })).toBe(state);
  });

  it("advances to the next question", () => {
    const revealed = gameReducer(started(), { type: "answer", answerId: "lula" });
    const next = gameReducer(revealed, { type: "next" });

    expect(next.phase).toBe("playing");
    expect(next.index).toBe(1);
  });

  it("finishes after the last question", () => {
    let state: GameState = started();

    for (const quote of quotes) {
      state = gameReducer(state, { type: "answer", answerId: answerFor(quote.politician) });
      state = gameReducer(state, { type: "next" });
    }

    expect(state.phase).toBe("finished");
    expect(state.answers).toHaveLength(3);
  });

  it("restart returns to idle", () => {
    const state = gameReducer(started(), { type: "restart" });

    expect(state).toEqual(initialGameState);
  });
});
