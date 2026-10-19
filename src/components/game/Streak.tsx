import { cn } from "@/lib/cn";
import { riseAt } from "@/lib/rise";

type StreakProps = {
  streak: number;
  /** Streak that was just lost on this question, shown crossed out */
  broken: number;
};

export const streakThreshold = 2;

export function Streak({ streak, broken }: StreakProps) {
  const active = streak >= streakThreshold;
  const lost = broken >= streakThreshold;

  if (!active && !lost) {
    return null;
  }

  return (
    <p
      style={riseAt(0.15)}
      className={cn(
        "rise inline-flex w-fit -rotate-[1.5deg] items-center gap-2 py-1.5 pr-3 pl-2 font-label text-xs leading-none font-bold tracking-[0.22em] uppercase shadow-[2px_2px_0_var(--color-ink)]",
        lost ? "bg-ink text-paper-3 line-through decoration-danger decoration-[3px]" : "bg-accent text-paper",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("inline-block origin-[50%_90%] text-base", lost ? "opacity-60 grayscale" : "animate-flame")}
      >
        🔥
      </span>
      {lost ? `${broken} seguidas` : `${streak} seguidas`}
    </p>
  );
}
