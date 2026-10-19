import type { Metadata, Viewport } from "next";
import { Anton, Newsreader, Oswald, Special_Elite } from "next/font/google";
import { cn } from "@/lib/cn";
import { siteDescription, siteName, siteTagline, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#efe5cf",
};

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite" });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(anton.variable, oswald.variable, newsreader.variable, specialElite.variable, "h-full antialiased")}
    >
      <body className="flex min-h-full flex-col">
        <div className="paper mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col overflow-x-clip sm:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          {children}
        </div>
      </body>
    </html>
  );
}
