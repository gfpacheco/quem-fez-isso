import { answerFor, answerIds, bothSidesId, type AnswerId, type Quote } from "@/data/types";
import type { Answer } from "./reducer";

export type Rank = {
  title: string;
  description: string;
  /** Minimum hit ratio (0–1) to earn this rank */
  minRatio: number;
};

export type Tally = { correct: number; total: number };

/** confusion[actual][guess] = how many quotes by `actual` were attributed to `guess` */
export type ConfusionMatrix = Record<AnswerId, Record<AnswerId, number>>;

export type Summary = {
  correct: number;
  total: number;
  score: number;
  bestStreak: number;
  byAnswer: Record<AnswerId, Tally>;
  confusion: ConfusionMatrix;
  rank: Rank;
  insight: string;
};

type SideId = Exclude<AnswerId, typeof bothSidesId>;

type SummaryInput = {
  quotes: Quote[];
  answers: Answer[];
  bestStreak?: number;
};

export const ranks: Rank[] = [
  {
    title: "Cego Partidário",
    description: "Só enxerga defeito do outro lado. E erra até esse.",
    minRatio: 0,
  },
  {
    title: "Militante Confuso",
    description: "Defende um, mas não sabe o que ele fez.",
    minRatio: 0.4,
  },
  {
    title: "Isentão Honesto",
    description: "Reconhece a polêmica venha de onde vier.",
    minRatio: 0.6,
  },
  {
    title: "Auditor da Polêmica",
    description: "Sabe quem fez o quê, e ainda lembra a fonte.",
    minRatio: 0.8,
  },
  {
    title: "Jornalista de Plantão",
    description: "Acertou tudo. Você acompanha de perto demais.",
    minRatio: 1,
  },
];

export const perfectInsight =
  "Você acertou tudo. Ou acompanha política de perto demais, ou chutou muito bem.";

const sideIds: SideId[] = ["lula", "bolsonaro"];

/** Portuguese phrasing per side: Lula is one person, "os Bolsonaro" are two */
const sidePhrases: Record<SideId, { to: string; of: string; alsoDid: string; onlyDid: string }> = {
  lula: { to: "ao Lula", of: "do Lula", alsoDid: "o Lula também fez", onlyDid: "só o Lula fez" },
  bolsonaro: {
    to: "aos Bolsonaro",
    of: "dos Bolsonaro",
    alsoDid: "os Bolsonaro também fizeram",
    onlyDid: "só os Bolsonaro fizeram",
  },
};

export function summarize({ quotes, answers, bestStreak = 0 }: SummaryInput) {
  const confusion = buildConfusion({ quotes, answers });
  const byAnswer = buildTallies(confusion);
  const correct = answers.filter((answer) => answer.correct).length;
  const total = answers.length;
  const score = answers.reduce((sum, answer) => sum + answer.points, 0);
  const partial = { correct, total, score, bestStreak, byAnswer, confusion, rank: rankFor(correct, total) };

  return { ...partial, insight: pickInsight(partial) };
}

export function buildConfusion({ quotes, answers }: Pick<SummaryInput, "quotes" | "answers">) {
  const quoteById = new Map(quotes.map((quote) => [quote.id, quote]));
  const confusion = Object.fromEntries(
    answerIds.map((actual) => [actual, Object.fromEntries(answerIds.map((guess) => [guess, 0]))]),
  ) as ConfusionMatrix;

  for (const answer of answers) {
    const quote = quoteById.get(answer.quoteId);

    if (quote) {
      confusion[answerFor(quote.politician)][answer.guess] += 1;
    }
  }

  return confusion;
}

export function rankFor(correct: number, total: number) {
  const ratio = total === 0 ? 0 : correct / total;

  return [...ranks].reverse().find((rank) => ratio >= rank.minRatio) ?? ranks[0];
}

/** The most painful observation available, ranked by how much it hurts the player's worldview */
export function pickInsight({ confusion, byAnswer }: Pick<Summary, "confusion" | "byAnswer">) {
  const candidates = [
    bothSidesMissInsight(confusion),
    blamedBothSidesInsight(confusion),
    crossSideInsight(confusion),
    accuracyGapInsight(byAnswer),
  ].filter((candidate) => candidate !== null);

  if (candidates.length === 0) {
    return perfectInsight;
  }

  return candidates.sort((a, b) => b.pain - a.pain || b.count - a.count)[0].text;
}

function buildTallies(confusion: ConfusionMatrix) {
  const tallies = {} as Record<AnswerId, Tally>;

  for (const actual of answerIds) {
    const total = answerIds.reduce((sum, guess) => sum + confusion[actual][guess], 0);
    tallies[actual] = { correct: confusion[actual][actual], total };
  }

  return tallies;
}

function bothSidesMissInsight(confusion: ConfusionMatrix) {
  const misses = sideIds.map((guess) => ({ guess, count: confusion[bothSidesId][guess] }));
  const count = misses.reduce((sum, miss) => sum + miss.count, 0);

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    const { guess } = misses.find((miss) => miss.count === 1)!;
    const other = guess === "lula" ? "bolsonaro" : "lula";

    return {
      pain: 4,
      count,
      text: `Você atribuiu ${sidePhrases[guess].to} algo que ${sidePhrases[other].alsoDid}.`,
    };
  }

  return {
    pain: 4,
    count,
    text: `${count} vezes você achou que só um lado fazia algo que os dois lados fizeram.`,
  };
}

function blamedBothSidesInsight(confusion: ConfusionMatrix) {
  const top = maxCell(sideIds.map((actual) => [actual, bothSidesId] as const), confusion);

  if (!top) {
    return null;
  }

  return {
    pain: 3,
    count: top.count,
    text: `Você atribuiu aos dois lados algo que ${sidePhrases[top.actual].onlyDid}.`,
  };
}

function crossSideInsight(confusion: ConfusionMatrix) {
  const top = maxCell(
    sideIds.map((actual) => [actual, actual === "lula" ? "bolsonaro" : "lula"] as const),
    confusion,
  );

  if (!top) {
    return null;
  }

  const atitudes = top.count === 1 ? "atitude" : "atitudes";

  return {
    pain: 2,
    count: top.count,
    text: `Você atribuiu ${top.count} ${atitudes} ${sidePhrases[top.actual].of} ${sidePhrases[top.guess].to}.`,
  };
}

function accuracyGapInsight(byAnswer: Record<AnswerId, Tally>) {
  const rates = sideIds
    .filter((id) => byAnswer[id].total > 0)
    .map((id) => ({ id, rate: byAnswer[id].correct / byAnswer[id].total }))
    .sort((a, b) => b.rate - a.rate);

  if (rates.length < 2) {
    return null;
  }

  const best = rates[0];
  const worst = rates[rates.length - 1];
  const gap = best.rate - worst.rate;

  if (gap < 0.5) {
    return null;
  }

  return {
    pain: 1,
    count: gap,
    text: `Você acertou ${percent(best.rate)} ${sidePhrases[best.id].of} e só ${percent(worst.rate)} ${sidePhrases[worst.id].of}.`,
  };
}

function maxCell<Actual extends AnswerId, Guess extends AnswerId>(
  cells: readonly (readonly [Actual, Guess])[],
  confusion: ConfusionMatrix,
) {
  let top: { actual: Actual; guess: Guess; count: number } | null = null;

  for (const [actual, guess] of cells) {
    const count = confusion[actual][guess];

    if (count > 0 && (top === null || count > top.count)) {
      top = { actual, guess, count };
    }
  }

  return top;
}

function percent(ratio: number) {
  return `${Math.round(ratio * 100)}%`;
}
