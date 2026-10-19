import { bothSidesId, type AnswerId } from "@/data/types";

export const politicianPoints = 100;
export const bothSidesPoints = 150;
export const streakBonusStep = 25;
export const streakBonusCap = 100;

type AnswerScore = {
  correct: boolean;
  actual: AnswerId;
  /** Streak length counting this answer */
  streak: number;
};

export function pointsForAnswer({ correct, actual, streak }: AnswerScore) {
  if (!correct) {
    return 0;
  }

  return pointsForCorrect(actual) + streakBonus(streak);
}

export function pointsForCorrect(actual: AnswerId) {
  return actual === bothSidesId ? bothSidesPoints : politicianPoints;
}

export function streakBonus(streak: number) {
  if (streak <= 1) {
    return 0;
  }

  return Math.min(streakBonusStep * (streak - 1), streakBonusCap);
}
