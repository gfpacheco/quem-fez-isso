import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type KbdProps = {
  children: ReactNode;
  className?: string;
};

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "hidden h-5 min-w-5 items-center justify-center border border-ink px-1 font-label text-[10px] font-medium tracking-[0.1em] text-ink uppercase sm:inline-flex",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
