import type { AuthorId, Quote } from "@/data/types";

export function makeQuote(id: string, politician: AuthorId) {
  return {
    id,
    politician,
    text: `Texto ${id}`,
    context: `Contexto ${id}`,
    year: 2020,
    difficulty: 2,
    sources: [{ title: "Fonte", url: `https://example.com/${id}` }],
  } satisfies Quote;
}

export function makeQuotes(politician: AuthorId, count: number) {
  return Array.from({ length: count }, (_, i) =>
    makeQuote(`${politician}-${String(i + 1).padStart(3, "0")}`, politician),
  );
}

/** Deterministic pseudo-random generator (mulberry32) for tests */
export function seededRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
