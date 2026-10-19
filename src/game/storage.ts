import { answerIds, type AnswerId } from "@/data/types";
import type { Summary, Tally } from "./summary";

export type Stats = {
  bestScore: number;
  roundsPlayed: number;
  byAnswer: Record<AnswerId, Tally>;
};

export const seenKey = "qfi:seen";
export const statsKey = "qfi:stats";

export const emptyStats: Stats = {
  bestScore: 0,
  roundsPlayed: 0,
  byAnswer: Object.fromEntries(answerIds.map((id) => [id, { correct: 0, total: 0 }])) as Record<
    AnswerId,
    Tally
  >,
};

export function loadSeenIds() {
  return parseSeenIds(readRaw(seenKey));
}

/** Tolerates tampered or outdated storage: anything that is not a list of ids counts as nothing seen */
export function parseSeenIds(raw: string | null) {
  const stored = safeParse(raw);
  const ids = Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];

  return new Set(ids);
}

export function markSeen(ids: string[]) {
  const seen = loadSeenIds();
  ids.forEach((id) => seen.add(id));
  writeJson(seenKey, [...seen]);
}

export function clearSeen() {
  writeJson(seenKey, []);
}

export function loadStats() {
  return parseStats(readRaw(statsKey));
}

/** Tolerates tampered or outdated storage: every malformed field falls back to its empty value */
export function parseStats(raw: string | null) {
  const stored = safeParse(raw);

  if (!isRecord(stored)) {
    return emptyStats;
  }

  const byAnswer = isRecord(stored.byAnswer) ? stored.byAnswer : {};

  return {
    bestScore: numberOr(stored.bestScore, emptyStats.bestScore),
    roundsPlayed: numberOr(stored.roundsPlayed, emptyStats.roundsPlayed),
    byAnswer: Object.fromEntries(
      answerIds.map((id) => [id, tallyOr(byAnswer[id], emptyStats.byAnswer[id])]),
    ) as Record<AnswerId, Tally>,
  } satisfies Stats;
}

export function recordRound(summary: Summary) {
  const stats = loadStats();
  const byAnswer = { ...stats.byAnswer };

  for (const id of answerIds) {
    byAnswer[id] = {
      correct: byAnswer[id].correct + summary.byAnswer[id].correct,
      total: byAnswer[id].total + summary.byAnswer[id].total,
    };
  }

  writeJson(statsKey, {
    bestScore: Math.max(stats.bestScore, summary.score),
    roundsPlayed: stats.roundsPlayed + 1,
    byAnswer,
  } satisfies Stats);
}

/** Raw snapshot for useSyncExternalStore; strings compare by value so it stays stable */
export function readStatsSnapshot() {
  return readRaw(statsKey);
}

export function subscribeToStorage(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onChange);

  return () => window.removeEventListener("storage", onChange);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function tallyOr(value: unknown, fallback: Tally) {
  if (!isRecord(value)) {
    return fallback;
  }

  return { correct: numberOr(value.correct, fallback.correct), total: numberOr(value.total, fallback.total) };
}

function readRaw(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeParse(raw: string | null) {
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked (private mode); the game still works without it
  }
}
