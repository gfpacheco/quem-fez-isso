import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/og/BrandMark";
import { ogFonts } from "@/lib/og/fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={size.width} rounded={false} />, { ...size, fonts: [ogFonts.display] });
}
