import { cn } from "@/lib/cn";

type SilhouetteProps = {
  initials: string;
  color?: "ink" | "accent";
  className?: string;
};

const colorClasses = {
  ink: "fill-ink",
  accent: "fill-accent",
};

/** Anonymous mugshot bust with initials stamped on the chest */
export function Silhouette({ initials, color = "ink", className }: SilhouetteProps) {
  return (
    <span className={cn("relative block", className)}>
      <svg viewBox="0 0 80 80" aria-hidden="true" className={cn("block size-full", colorClasses[color])}>
        <circle cx="40" cy="26" r="17" />
        <path d="M6 80c0-20 15-31 34-31s34 11 34 31z" />
      </svg>
      <b className="absolute bottom-0.5 left-1/2 -translate-x-1/2 font-display text-[0.3em] leading-none tracking-[0.04em] text-paper">
        {initials}
      </b>
    </span>
  );
}
