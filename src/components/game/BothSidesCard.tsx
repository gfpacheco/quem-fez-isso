"use client";

import { Kbd } from "@/components/ui/Kbd";
import { Silhouette } from "@/components/ui/Silhouette";
import type { AnswerOption } from "@/data/politicians";
import { cn } from "@/lib/cn";
import { RevealMark, RevealTag } from "./RevealMarks";
import type { SuspectState } from "./SuspectCard";

type BothSidesCardProps = {
  option: AnswerOption;
  shortcut: string;
  state: SuspectState;
  tag: string | null;
  onClick: () => void;
};

const stateClasses: Record<SuspectState, string> = {
  idle: "cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-accent)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--color-accent)]",
  truth: "-rotate-1 bg-paper-2",
  wrong: "-rotate-1 opacity-70",
  dimmed: "opacity-50",
};

/** The wide "joint file" option: Lula and a Bolsonaro did the same thing */
export function BothSidesCard({ option, shortcut, state, tag, onClick }: BothSidesCardProps) {
  const revealed = state !== "idle";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      className={cn(
        "relative grid w-full grid-cols-[62px_1fr_auto] items-center gap-3 border-2 border-dashed border-accent bg-paper px-3 py-2 text-left shadow-hard-accent transition-[transform,box-shadow,opacity] duration-100",
        stateClasses[state],
      )}
    >
      <span aria-hidden="true" className="relative h-[42px] w-[62px]">
        <Silhouette initials="" className="absolute top-0.5 left-0 size-[38px]" />
        <Silhouette initials="" color="accent" className="absolute top-0.5 right-0 size-[38px]" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xl leading-none drop-shadow-[0_0_2px_var(--color-paper)]">
          🤝
        </span>
      </span>

      <span className="flex flex-col gap-1">
        <span className="font-display text-base leading-none tracking-[0.04em] uppercase">{option.name}</span>
        <span className="font-body text-[11px] leading-tight font-medium text-ink-2 italic">{option.detail}</span>
      </span>

      <span className="flex flex-col items-end gap-1.5">
        <Kbd>{shortcut}</Kbd>
        <span className="text-right font-type text-[10px] leading-tight text-accent uppercase">
          Arquivo
          <br />
          conjunto
        </span>
      </span>

      <RevealMark state={state} shape="wide" />
      <RevealTag state={state} tag={tag} className="-top-2.5 right-3 -rotate-2" />
    </button>
  );
}
