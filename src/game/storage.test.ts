import { describe, expect, it } from "vitest";
import { emptyStats, parseSeenIds, parseStats } from "./storage";

describe("parseSeenIds", () => {
  it("reads a list of ids", () => {
    expect(parseSeenIds('["lula-001","jair-002"]')).toEqual(new Set(["lula-001", "jair-002"]));
  });

  it("falls back to nothing seen when storage is missing or malformed", () => {
    expect(parseSeenIds(null)).toEqual(new Set());
    expect(parseSeenIds("{}")).toEqual(new Set());
    expect(parseSeenIds("not json")).toEqual(new Set());
  });

  it("drops entries that are not ids", () => {
    expect(parseSeenIds('["lula-001", 7, null, {}]')).toEqual(new Set(["lula-001"]));
  });
});

describe("parseStats", () => {
  it("reads well-formed stats", () => {
    const stats = {
      bestScore: 425,
      roundsPlayed: 3,
      byAnswer: {
        lula: { correct: 5, total: 9 },
        bolsonaro: { correct: 7, total: 12 },
        ambos: { correct: 2, total: 6 },
      },
    };

    expect(parseStats(JSON.stringify(stats))).toEqual(stats);
  });

  it("falls back to empty stats when storage is missing or not an object", () => {
    expect(parseStats(null)).toEqual(emptyStats);
    expect(parseStats("[]")).toEqual(emptyStats);
    expect(parseStats("not json")).toEqual(emptyStats);
  });

  it("replaces malformed tallies with empty ones", () => {
    const stats = parseStats('{"roundsPlayed":2,"byAnswer":{"lula":null,"bolsonaro":{"correct":"x"},"ambos":{"correct":1,"total":2}}}');

    expect(stats.byAnswer).toEqual({
      lula: { correct: 0, total: 0 },
      bolsonaro: { correct: 0, total: 0 },
      ambos: { correct: 1, total: 2 },
    });
    expect(stats.roundsPlayed).toBe(2);
  });

  it("replaces malformed counters with zero", () => {
    const stats = parseStats('{"bestScore":"100","roundsPlayed":null,"byAnswer":"nope"}');

    expect(stats).toEqual(emptyStats);
  });
});
