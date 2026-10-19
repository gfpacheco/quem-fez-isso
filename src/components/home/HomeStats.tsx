"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseStats, readStatsSnapshot, subscribeToStorage } from "@/game/storage";

export function HomeStats() {
  const raw = useSyncExternalStore(subscribeToStorage, readStatsSnapshot, () => null);
  const stats = useMemo(() => parseStats(raw), [raw]);

  if (stats.roundsPlayed === 0) {
    return null;
  }

  return (
    <p className="font-type text-[11px] leading-relaxed text-ink-2">
      Seu melhor placar: <b className="font-bold text-accent">{stats.bestScore}</b> · Rodadas lidas:{" "}
      <b className="font-bold text-accent">{stats.roundsPlayed}</b>
    </p>
  );
}
