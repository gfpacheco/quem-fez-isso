import { useCallback, useEffect, useMemo, useReducer } from "react";
import { allQuotes } from "@/data/quotes";
import type { AnswerId } from "@/data/types";
import { pickRound } from "./pickRound";
import { gameReducer, initialGameState, type GameState } from "./reducer";
import { clearSeen, loadSeenIds, markSeen, recordRound } from "./storage";
import { summarize } from "./summary";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const start = useCallback(() => {
    const seenIds = loadSeenIds();
    const { quotes, resetSeen } = pickRound({ quotes: allQuotes, seenIds });

    if (resetSeen) {
      clearSeen();
    }

    dispatch({ type: "start", quotes });
  }, []);

  const answer = useCallback((answerId: AnswerId) => dispatch({ type: "answer", answerId }), []);

  // Persisting here, in the event, keeps it to exactly once per round (an effect would re-run under StrictMode)
  const next = useCallback(() => {
    const nextState = gameReducer(state, { type: "next" });
    dispatch({ type: "next" });

    if (nextState.phase === "finished") {
      persistRound(nextState);
    }
  }, [state]);

  const restart = useCallback(() => {
    dispatch({ type: "restart" });
    start();
  }, [start]);

  const summary = useMemo(() => {
    if (state.phase !== "finished") {
      return null;
    }

    return summarize(state);
  }, [state]);

  // The round is picked from localStorage, so it can only start on the client
  useEffect(() => {
    start();
  }, [start]);

  return {
    state,
    currentQuote: state.quotes[state.index] ?? null,
    lastAnswer: state.answers[state.answers.length - 1] ?? null,
    summary,
    start,
    answer,
    next,
    restart,
  };
}

function persistRound(state: GameState) {
  recordRound(summarize(state));
  markSeen(state.quotes.map((quote) => quote.id));
}
