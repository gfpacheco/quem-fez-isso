import type { CSSProperties } from "react";

/** Inline delay for the `rise` entrance utility, so siblings can stagger in */
export function riseAt(seconds: number) {
  return { "--rise-delay": `${seconds}s` } as CSSProperties;
}
