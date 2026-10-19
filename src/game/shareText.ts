import { bothSidesId, type Quote } from "@/data/types";
import { siteName, siteUrl } from "@/lib/site";
import type { Answer } from "./reducer";
import type { Summary } from "./summary";

export { siteUrl };

const hitEmoji = "🟢";
const bothSidesHitEmoji = "🟡";
const missEmoji = "🔴";

type ShareInput = {
  quotes: Quote[];
  answers: Answer[];
  summary: Summary;
};

export function buildShareText({ quotes, answers, summary }: ShareInput) {
  return [
    `${siteName} ${summary.correct}/${summary.total} · ${summary.score} pts`,
    shareGrid({ quotes, answers }),
    `🏅 ${summary.rank.title}`,
    summary.insight,
    "",
    siteUrl,
  ].join("\n");
}

export function shareGrid({ quotes, answers }: Pick<ShareInput, "quotes" | "answers">) {
  const quoteById = new Map(quotes.map((quote) => [quote.id, quote]));

  return answers
    .map((answer) => {
      if (!answer.correct) {
        return missEmoji;
      }

      return quoteById.get(answer.quoteId)?.politician === bothSidesId ? bothSidesHitEmoji : hitEmoji;
    })
    .join("");
}
