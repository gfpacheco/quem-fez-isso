import { describe, expect, it } from "vitest";
import { pointsForAnswer, pointsForCorrect, streakBonus } from "./scoring";

describe("pointsForCorrect", () => {
  it("gives 100 for a side and 150 for both sides", () => {
    expect(pointsForCorrect("lula")).toBe(100);
    expect(pointsForCorrect("bolsonaro")).toBe(100);
    expect(pointsForCorrect("ambos")).toBe(150);
  });
});

describe("streakBonus", () => {
  it("is 0 for the first hit of a streak", () => {
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(0)).toBe(0);
  });

  it("adds 25 per extra consecutive hit", () => {
    expect(streakBonus(2)).toBe(25);
    expect(streakBonus(3)).toBe(50);
    expect(streakBonus(5)).toBe(100);
  });

  it("caps at 100", () => {
    expect(streakBonus(6)).toBe(100);
    expect(streakBonus(10)).toBe(100);
  });
});

describe("pointsForAnswer", () => {
  it("gives 0 for a wrong answer", () => {
    expect(pointsForAnswer({ correct: false, actual: "lula", streak: 0 })).toBe(0);
  });

  it("adds base points and streak bonus", () => {
    expect(pointsForAnswer({ correct: true, actual: "lula", streak: 1 })).toBe(100);
    expect(pointsForAnswer({ correct: true, actual: "lula", streak: 3 })).toBe(150);
    expect(pointsForAnswer({ correct: true, actual: "ambos", streak: 2 })).toBe(175);
  });
});
