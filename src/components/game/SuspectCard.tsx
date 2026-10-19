"use client";

import { Kbd } from "@/components/ui/Kbd";
import type { AnswerOption } from "@/data/politicians";
import { cn } from "@/lib/cn";
import { Ficha, fichaClasses } from "./Ficha";
import { RevealMark, RevealTag } from "./RevealMarks";

export type SuspectState = "idle" | "truth" | "wrong" | "dimmed";

type SuspectCardProps = {
  option: AnswerOption;
  shortcut: string;
  state: SuspectState;
  /** Red marker tag pinned under the card once revealed */
  tag: string | null;
  onClick: () => void;
};

const heights = ["1,80", "1,70", "1,60"];

const stateClasses: Record<SuspectState, string> = {
  idle: "cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--color-ink)]",
  truth: "-rotate-2",
  wrong: "-rotate-2",
  dimmed: "opacity-55",
};

export function SuspectCard({ option, shortcut, state, tag, onClick }: SuspectCardProps) {
  const revealed = state !== "idle";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      aria-label={[option.name, option.detail, tag].filter(Boolean).join(", ")}
      className={cn(
        fichaClasses,
        "px-1.5 pt-2.5 pb-2.5 transition-[transform,box-shadow,opacity] duration-100",
        stateClasses[state],
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-1 flex flex-col font-type text-[8px] leading-[14px] text-mute"
      >
        {heights.map((height) => (
          <span key={height}>{height}</span>
        ))}
      </span>
      <Kbd className="absolute top-1.5 right-1.5">{shortcut}</Kbd>

      <Ficha option={option} className={cn(state === "wrong" && "opacity-55")} />

      <RevealMark state={state} shape="portrait" />
      <RevealTag state={state} tag={tag} className="-bottom-2.5 left-1/2 -translate-x-1/2 -rotate-3" />
    </button>
  );
}
