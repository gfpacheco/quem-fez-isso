import { bothSidesId, type AnswerId, type AuthorId, type PoliticianId } from "./types";

export type Politician = {
  id: PoliticianId;
  name: "Lula" | "Jair Bolsonaro" | "Flávio Bolsonaro";
  shortName: string;
};

export type AnswerOption = {
  id: AnswerId;
  name: string;
  /** Keyboard key that picks this answer */
  shortcut: string;
  /** Sub-label printed on the suspect card */
  detail: string;
  /** Initials stamped on the silhouette */
  initials: string;
  /** Fake police file number */
  fileNumber: string;
};

export const politicians: Record<PoliticianId, Politician> = {
  lula: { id: "lula", name: "Lula", shortName: "Lula" },
  jair: { id: "jair", name: "Jair Bolsonaro", shortName: "Jair" },
  flavio: { id: "flavio", name: "Flávio Bolsonaro", shortName: "Flávio" },
};

export const answerOptions: AnswerOption[] = [
  { id: "lula", name: "Lula", shortcut: "L", detail: "Presidente", initials: "L", fileNumber: "0013" },
  { id: "bolsonaro", name: "Bolsonaro", shortcut: "B", detail: "Jair ou Flávio", initials: "B", fileNumber: "0022" },
  { id: bothSidesId, name: "Os dois lados", shortcut: "A", detail: "Lula e um Bolsonaro fizeram isso", initials: "🤝", fileNumber: "0000" },
];

export function getAnswerOption(id: AnswerId) {
  return answerOptions.find((option) => option.id === id)!;
}

/** Who exactly did it, for the reveal: "Flávio Bolsonaro" rather than the "Bolsonaro" answer */
export function authorName(politician: AuthorId) {
  return politician === bothSidesId ? getAnswerOption(bothSidesId).name : politicians[politician].name;
}
