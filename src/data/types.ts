export const bothSidesId = "ambos" as const;

/** What the player can answer. Jair and Flávio collapse into a single "bolsonaro" answer. */
export const answerIds = ["lula", "bolsonaro", bothSidesId] as const;

export type PoliticianId = "lula" | "jair" | "flavio";

export type AnswerId = (typeof answerIds)[number];

/** Who actually did it: a specific politician, or "ambos" when both sides did */
export type AuthorId = PoliticianId | typeof bothSidesId;

export type Difficulty = 1 | 2 | 3;

export type Source = {
  title: string;
  url: string;
};

export type Quote = {
  /** Stable unique id, e.g. "lula-001" or "ambos-001" */
  id: string;
  /**
   * Who did it. "ambos" means Lula AND at least one Bolsonaro (Jair or Flávio)
   * did the same thing — the correct answer is "Os dois lados".
   */
  politician: AuthorId;
  /**
   * The action, in third person, written so it does NOT reveal the author.
   * Statements are actions too: "Disse que ..." / "Chamou X de ...".
   * For "ambos": generalized so it applies to both sides.
   */
  text: string;
  /**
   * Where/when it happened. Shown only after the answer.
   * For "ambos": explain each side's instance (who, when, what happened).
   */
  context: string;
  year: number;
  /** 2 = medium, 3 = hard (could plausibly be either side). 1 (obvious) is not used in the game. */
  difficulty: Difficulty;
  /** One or more reputable sources. For "ambos": at least one per side. */
  sources: Source[];
};

export function answerFor(politician: AuthorId) {
  if (politician === "jair" || politician === "flavio") {
    return "bolsonaro";
  }

  return politician;
}
