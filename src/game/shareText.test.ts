import { describe, expect, it } from "vitest";
import { buildShareText, shareGrid, siteUrl } from "./shareText";
import { summarize } from "./summary";
import { makeQuote } from "./testUtils";

const quotes = [
  makeQuote("lula-1", "lula"),
  makeQuote("ambos-1", "ambos"),
  makeQuote("jair-1", "jair"),
];

const answers = [
  { quoteId: "lula-1", guess: "lula", correct: true, points: 100 },
  { quoteId: "ambos-1", guess: "ambos", correct: true, points: 175 },
  { quoteId: "jair-1", guess: "lula", correct: false, points: 0 },
] as const;

describe("shareGrid", () => {
  it("uses green for hits, yellow for both-sides hits and red for misses", () => {
    expect(shareGrid({ quotes, answers: [...answers] })).toBe("🟢🟡🔴");
  });
});

describe("buildShareText", () => {
  it("includes score, grid, rank, insight and url", () => {
    const summary = summarize({ quotes, answers: [...answers], bestStreak: 2 });
    const text = buildShareText({ quotes, answers: [...answers], summary });
    const lines = text.split("\n");

    expect(lines[0]).toBe("Quem fez isso? 2/3 · 275 pts");
    expect(lines[1]).toBe("🟢🟡🔴");
    expect(lines[2]).toBe(`🏅 ${summary.rank.title}`);
    expect(lines[3]).toBe(summary.insight);
    expect(lines[4]).toBe("");
    expect(lines[5]).toBe(siteUrl);
  });
});
