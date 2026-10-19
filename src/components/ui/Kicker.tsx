import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type KickerAlign = "center" | "left";

type KickerProps = ComponentProps<"p"> & {
  /** Centered labels get a rule on each side; left-aligned ones only trail off to the right */
  align?: KickerAlign;
};

const ruleClasses: Record<KickerAlign, string> = {
  center: "before:flex-1 before:border-t before:border-ink after:flex-1 after:border-t after:border-ink",
  left: "after:flex-1 after:border-t after:border-ink",
};

/** Small caps section label with a rule on each side, newspaper style */
export function Kicker({ align = "center", className, children, ...props }: KickerProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-label text-[11px] font-medium tracking-[0.26em] uppercase",
        ruleClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
