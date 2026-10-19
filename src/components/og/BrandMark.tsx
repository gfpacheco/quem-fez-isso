import { ogColors } from "@/lib/og/colors";

type BrandMarkProps = {
  size: number;
  /** iOS masks the apple-icon corners itself, so it needs a full-bleed square */
  rounded?: boolean;
};

/** The orange question mark on an ink block, the app icon at every size */
export function BrandMark({ size, rounded = true }: BrandMarkProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        borderRadius: rounded ? size * 0.18 : 0,
        background: ogColors.ink,
        color: ogColors.accent,
        fontFamily: "Anton",
        fontSize: size * 0.92,
        lineHeight: 1,
      }}
    >
      ?
    </div>
  );
}
