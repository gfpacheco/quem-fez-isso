import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type TapeProps = {
  items: string[];
  className?: string;
  style?: CSSProperties;
};

/** Red "breaking news" ribbon scrolling across the page */
export function Tape({ items, className, style }: TapeProps) {
  // The track is doubled so the marquee loops seamlessly at -50%
  const track = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "overflow-hidden bg-accent py-1.5 font-label text-xs font-bold tracking-[0.22em] whitespace-nowrap text-paper uppercase shadow-[0_2px_0_var(--color-accent-2)]",
        className,
      )}
    >
      <div className="inline-flex animate-marquee">
        {track.map((item, index) => (
          <span key={index} className="px-3.5 after:ml-7 after:opacity-80 after:content-['★']">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
