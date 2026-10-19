import { Silhouette } from "@/components/ui/Silhouette";
import type { AnswerOption } from "@/data/politicians";
import { cn } from "@/lib/cn";

type FichaProps = {
  option: AnswerOption;
  className?: string;
};

/** Police file card look shared by the home line-up and the answer buttons */
export const fichaClasses =
  "ruled relative border-2 border-ink bg-paper-2 text-center shadow-hard before:absolute before:-top-2 before:left-1/2 before:h-3.5 before:w-12 before:-translate-x-1/2 before:-rotate-3 before:border before:border-ink/25 before:bg-white/55 before:mix-blend-screen";

export function Ficha({ option, className }: FichaProps) {
  return (
    <span className={cn("flex flex-col items-center", className)}>
      <span className="mb-1.5 font-type text-[11px] leading-none tracking-[0.04em] text-ink-2">
        Ficha Nº {option.fileNumber}
      </span>
      <Silhouette initials={option.initials} className="size-[70px] text-[70px]" />
      <span className="mt-2 font-display text-base leading-none tracking-[0.04em] uppercase">{option.name}</span>
      <span className="mt-1 font-body text-[11px] leading-tight font-medium text-ink-2 italic">{option.detail}</span>
    </span>
  );
}
