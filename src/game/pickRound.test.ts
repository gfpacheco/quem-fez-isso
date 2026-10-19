import { describe, expect, it } from "vitest";
import { answerFor, answerIds, type AnswerId, type AuthorId } from "@/data/types";
import { bothSidesRange, perSideRange, pickRound, roundSize } from "./pickRound";
import { makeQuotes, seededRandom } from "./testUtils";

const pool = [
  ...makeQuotes("lula", 20),
  ...makeQuotes("jair", 20),
  ...makeQuotes("flavio", 20),
  ...makeQuotes("ambos", 8),
];

function countByAnswer(ids: AuthorId[]) {
  return answerIds.reduce(
    (acc, id) => ({ ...acc, [id]: ids.filter((x) => answerFor(x) === id).length }),
    {} as Record<AnswerId, number>,
  );
}

describe("pickRound", () => {
  it("returns 10 unique quotes", () => {
    const { quotes } = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(1) });

    expect(quotes).toHaveLength(roundSize);
    expect(new Set(quotes.map((q) => q.id)).size).toBe(roundSize);
  });

  it("is deterministic given the same random source", () => {
    const a = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(7) });
    const b = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(7) });

    expect(a.quotes.map((q) => q.id)).toEqual(b.quotes.map((q) => q.id));
  });

  it("keeps 1–3 both-sides items and 3–5 per side", () => {
    for (let seed = 0; seed < 50; seed++) {
      const { quotes } = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(seed) });
      const counts = countByAnswer(quotes.map((q) => q.politician));

      expect(counts.ambos).toBeGreaterThanOrEqual(bothSidesRange.min);
      expect(counts.ambos).toBeLessThanOrEqual(bothSidesRange.max);

      for (const id of ["lula", "bolsonaro"] as const) {
        expect(counts[id]).toBeGreaterThanOrEqual(perSideRange.min);
        expect(counts[id]).toBeLessThanOrEqual(perSideRange.max);
      }
    }
  });

  it("varies the composition between rounds", () => {
    const seen = { lula: new Set<number>(), bolsonaro: new Set<number>(), ambos: new Set<number>() };

    for (let seed = 0; seed < 50; seed++) {
      const { quotes } = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(seed) });
      const counts = countByAnswer(quotes.map((q) => q.politician));

      for (const id of answerIds) {
        seen[id].add(counts[id]);
      }
    }

    for (const id of answerIds) {
      expect(seen[id].size).toBeGreaterThan(1);
    }
  });

  it("alternates Jair and Flávio inside the Bolsonaro share", () => {
    for (let seed = 0; seed < 50; seed++) {
      const { quotes } = pickRound({ quotes: pool, seenIds: new Set(), random: seededRandom(seed) });
      const jair = quotes.filter((q) => q.politician === "jair").length;
      const flavio = quotes.filter((q) => q.politician === "flavio").length;

      expect(Math.abs(jair - flavio)).toBeLessThanOrEqual(1);
    }
  });

  it("prefers unseen quotes within each answer's share", () => {
    const seenIds = new Set(pool.filter((q) => !q.id.endsWith("1")).map((q) => q.id));

    for (let seed = 0; seed < 20; seed++) {
      const { quotes, resetSeen } = pickRound({ quotes: pool, seenIds, random: seededRandom(seed) });

      expect(resetSeen).toBe(false);

      for (const id of answerIds) {
        const own = quotes.filter((q) => answerFor(q.politician) === id);
        const pickedSeen = own.filter((q) => seenIds.has(q.id)).length;
        const unseenAvailable = pool.filter((q) => answerFor(q.politician) === id && !seenIds.has(q.id)).length;

        // A seen quote only fills in once that answer ran out of unseen ones
        if (pickedSeen > 0) {
          expect(own.length - pickedSeen).toBe(unseenAvailable);
        }
      }
    }
  });

  it("flags a reset when every quote was already seen", () => {
    const seenIds = new Set(pool.map((q) => q.id));
    const { quotes, resetSeen } = pickRound({ quotes: pool, seenIds, random: seededRandom(3) });

    expect(resetSeen).toBe(true);
    expect(quotes).toHaveLength(roundSize);
  });

  it("works without both-sides quotes", () => {
    const noBoth = pool.filter((q) => q.politician !== "ambos");
    const { quotes } = pickRound({ quotes: noBoth, seenIds: new Set(), random: seededRandom(2) });
    const counts = countByAnswer(quotes.map((q) => q.politician));

    expect(quotes).toHaveLength(roundSize);
    expect(counts.ambos).toBe(0);
  });

  it("fills the round even when balance constraints cannot be satisfied", () => {
    const small = [...makeQuotes("lula", 9), ...makeQuotes("jair", 1), ...makeQuotes("flavio", 1)];
    const { quotes } = pickRound({ quotes: small, seenIds: new Set(), random: seededRandom(2) });

    expect(quotes).toHaveLength(roundSize);
  });

  it("returns everything when there are fewer quotes than the round size", () => {
    const tiny = makeQuotes("lula", 4);
    const { quotes } = pickRound({ quotes: tiny, seenIds: new Set(), random: seededRandom(2) });

    expect(quotes).toHaveLength(4);
  });
});
