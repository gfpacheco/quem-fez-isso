import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Static TTFs of the app's next/font families, since ImageResponse can't use woff2 or variable fonts */
export const ogFonts = {
  display: await loadFont("Anton", "Anton-Regular.ttf"),
  label: await loadFont("Oswald", "Oswald-Medium.ttf", { weight: 500 }),
  body: await loadFont("Newsreader", "Newsreader-MediumItalic.ttf", { weight: 500, style: "italic" }),
  type: await loadFont("Special Elite", "SpecialElite-Regular.ttf"),
};

type FontVariant = {
  weight?: 400 | 500;
  style?: "normal" | "italic";
};

async function loadFont(name: string, file: string, { weight = 400, style = "normal" }: FontVariant = {}) {
  const data = await readFile(join(process.cwd(), "src/assets/fonts", file));

  return { name, data, weight, style };
}
