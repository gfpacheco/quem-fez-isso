import { describe, expect, it } from "vitest";
import { answerFor, type AnswerId, type AuthorId, type Quote } from "@/data/types";
import type { Answer } from "./reducer";
import { buildConfusion, pickInsight, rankFor, ranks, summarize } from "./summary";
import { makeQuote } from "./testUtils";

type Play = [AuthorId, AnswerId];

/** Builds quotes + answers from [actual author, guess] pairs */
function play(pairs: Play[]) {
  const quotes: Quote[] = [];
  const answers: Answer[] = [];

  pairs.forEach(([author, guess], i) => {
    const quote = makeQuote(`${author}-${i}`, author);
    const correct = answerFor(author) === guess;
    quotes.push(quote);
    answers.push({ quoteId: quote.id, guess, correct, points: correct ? 100 : 0 });
  });

  return { quotes, answers };
}

describe("buildConfusion", () => {
  it("counts guesses per actual answer, folding Jair and Flávio into Bolsonaro", () => {
    const { quotes, answers } = play([
      ["lula", "bolsonaro"],
      ["lula", "bolsonaro"],
      ["lula", "lula"],
      ["ambos", "bolsonaro"],
      ["jair", "bolsonaro"],
      ["flavio", "bolsonaro"],
      ["flavio", "lula"],
    ]);
    const confusion = buildConfusion({ quotes, answers });

    expect(confusion.lula.bolsonaro).toBe(2);
    expect(confusion.lula.lula).toBe(1);
    expect(confusion.lula.ambos).toBe(0);
    expect(confusion.ambos.bolsonaro).toBe(1);
    expect(confusion.bolsonaro.bolsonaro).toBe(2);
    expect(confusion.bolsonaro.lula).toBe(1);
  });
});

describe("rankFor", () => {
  it("maps hit counts to ranks", () => {
    expect(rankFor(0, 10).title).toBe(ranks[0].title);
    expect(rankFor(3, 10).title).toBe(ranks[0].title);
    expect(rankFor(4, 10).title).toBe(ranks[1].title);
    expect(rankFor(5, 10).title).toBe(ranks[1].title);
    expect(rankFor(6, 10).title).toBe(ranks[2].title);
    expect(rankFor(7, 10).title).toBe(ranks[2].title);
    expect(rankFor(8, 10).title).toBe(ranks[3].title);
    expect(rankFor(9, 10).title).toBe(ranks[3].title);
    expect(rankFor(10, 10).title).toBe(ranks[4].title);
  });
});

describe("pickInsight", () => {
  it("celebrates a perfect round", () => {
    const { quotes, answers } = play([
      ["lula", "lula"],
      ["jair", "bolsonaro"],
    ]);

    expect(pickInsight(summarize({ quotes, answers }))).toMatch(/acertou tudo/i);
  });

  it("prefers both-sides misses over everything else", () => {
    const { quotes, answers } = play([
      ["ambos", "lula"],
      ["ambos", "bolsonaro"],
      ["lula", "bolsonaro"],
      ["lula", "bolsonaro"],
      ["lula", "bolsonaro"],
      ["jair", "lula"],
    ]);

    expect(pickInsight(summarize({ quotes, answers }))).toBe(
      "2 vezes você achou que só um lado fazia algo que os dois lados fizeram.",
    );
  });

  it("names the other side for a single both-sides miss", () => {
    const lula = play([["ambos", "lula"]]);
    const bolsonaro = play([["ambos", "bolsonaro"]]);

    expect(pickInsight(summarize(lula))).toBe(
      "Você atribuiu ao Lula algo que os Bolsonaro também fizeram.",
    );
    expect(pickInsight(summarize(bolsonaro))).toBe(
      "Você atribuiu aos Bolsonaro algo que o Lula também fez.",
    );
  });

  it("calls out blaming both sides for something only one did", () => {
    const flavio = play([
      ["flavio", "ambos"],
      ["lula", "bolsonaro"],
    ]);
    const lula = play([["lula", "ambos"]]);

    expect(pickInsight(summarize(flavio))).toBe(
      "Você atribuiu aos dois lados algo que só os Bolsonaro fizeram.",
    );
    expect(pickInsight(summarize(lula))).toBe(
      "Você atribuiu aos dois lados algo que só o Lula fez.",
    );
  });

  it("picks the most frequent cross-side confusion", () => {
    const { quotes, answers } = play([
      ["jair", "lula"],
      ["lula", "bolsonaro"],
      ["lula", "bolsonaro"],
    ]);

    expect(pickInsight(summarize({ quotes, answers }))).toBe(
      "Você atribuiu 2 atitudes do Lula aos Bolsonaro.",
    );
  });

  it("uses singular for a single cross-side miss", () => {
    const { quotes, answers } = play([["jair", "lula"]]);

    expect(pickInsight(summarize({ quotes, answers }))).toBe(
      "Você atribuiu 1 atitude dos Bolsonaro ao Lula.",
    );
  });

  it("falls back to the accuracy gap when misses went to both sides", () => {
    const { quotes, answers } = play([
      ["lula", "lula"],
      ["lula", "lula"],
      ["lula", "lula"],
      ["lula", "lula"],
      ["jair", "ambos"],
      ["flavio", "ambos"],
      ["flavio", "ambos"],
      ["jair", "bolsonaro"],
    ]);

    // Blaming both sides outranks the gap, so the gap only wins when nothing else applies
    expect(pickInsight(summarize({ quotes, answers }))).toBe(
      "Você atribuiu aos dois lados algo que só os Bolsonaro fizeram.",
    );
  });

  it("reports the accuracy gap when it is the only observation left", () => {
    const summary = summarize(play([["lula", "lula"], ["jair", "bolsonaro"]]));
    const byAnswer = {
      ...summary.byAnswer,
      lula: { correct: 4, total: 4 },
      bolsonaro: { correct: 1, total: 4 },
    };

    expect(pickInsight({ confusion: summary.confusion, byAnswer })).toBe(
      "Você acertou 100% do Lula e só 25% dos Bolsonaro.",
    );
  });
});

describe("summarize", () => {
  it("aggregates totals, per-answer breakdown and best streak", () => {
    const { quotes, answers } = play([
      ["lula", "lula"],
      ["lula", "bolsonaro"],
      ["jair", "bolsonaro"],
      ["ambos", "ambos"],
      ["flavio", "lula"],
    ]);
    const summary = summarize({ quotes, answers, bestStreak: 2 });

    expect(summary.correct).toBe(3);
    expect(summary.total).toBe(5);
    expect(summary.score).toBe(300);
    expect(summary.bestStreak).toBe(2);
    expect(summary.byAnswer).toEqual({
      lula: { correct: 1, total: 2 },
      bolsonaro: { correct: 1, total: 2 },
      ambos: { correct: 1, total: 1 },
    });
    expect(summary.rank.title).toBe(rankFor(3, 5).title);
    // Tie between two cross-side misses resolves in side order
    expect(summary.insight).toBe("Você atribuiu 1 atitude do Lula aos Bolsonaro.");
  });
});
