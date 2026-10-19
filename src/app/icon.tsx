import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/og/BrandMark";
import { ogFonts } from "@/lib/og/fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={size.width} />, { ...size, fonts: [ogFonts.display] });
}
