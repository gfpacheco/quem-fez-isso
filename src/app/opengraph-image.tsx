import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { answerOptions } from "@/data/politicians";
import { bothSidesId } from "@/data/types";
import { ogColors } from "@/lib/og/colors";
import { ogFonts } from "@/lib/og/fonts";
import { siteName, siteTagline, siteUrl } from "@/lib/site";

export const alt = `${siteName} — ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const suspects = answerOptions.filter((option) => option.id !== bothSidesId);
const suspectTilts = [-4, 3];

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "44px 60px 40px",
        background: ogColors.paper,
        color: ogColors.ink,
      }}
    >
      <Masthead />
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Headline />
        <Lineup />
      </div>
      <Footer />
    </div>,
    { ...size, fonts: Object.values(ogFonts) },
  );
}

const labelStyle: CSSProperties = {
  fontFamily: "Oswald",
  fontSize: 20,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

function Masthead() {
  return (
    <div
      style={{
        ...labelStyle,
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderTop: `2px solid ${ogColors.ink}`,
        borderBottom: `2px solid ${ogColors.ink}`,
      }}
    >
      <span>Brasília</span>
      <span>Edição extra · Nº 1</span>
      <span>R$ 0,00</span>
    </div>
  );
}

function Headline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Anton", textTransform: "uppercase" }}>
      <span style={{ fontSize: 176, lineHeight: 0.9 }}>Quem fez</span>
      <span style={{ fontSize: 176, lineHeight: 0.9, color: ogColors.accent }}>isso?</span>
      <div style={{ width: 470, height: 18, marginTop: 10, background: ogColors.accent }} />
    </div>
  );
}

function Lineup() {
  return (
    <div style={{ position: "relative", display: "flex", gap: 28 }}>
      {suspects.map((option, index) => (
        <SuspectCard key={option.id} name={option.name} initials={option.initials} fileNumber={option.fileNumber} tilt={suspectTilts[index]} />
      ))}
      <ConfidentialStamp />
    </div>
  );
}

type SuspectCardProps = {
  name: string;
  initials: string;
  fileNumber: string;
  tilt: number;
};

function SuspectCard({ name, initials, fileNumber, tilt }: SuspectCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 200,
        padding: "18px 14px 16px",
        border: `3px solid ${ogColors.ink}`,
        background: ogColors.paper2,
        boxShadow: `6px 6px 0 ${ogColors.ink}`,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <span style={{ fontFamily: "Special Elite", fontSize: 18, color: ogColors.ink2 }}>Ficha Nº {fileNumber}</span>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", width: 130, height: 130, marginTop: 10 }}>
        <svg viewBox="0 0 80 80" width={130} height={130} fill={ogColors.ink}>
          <circle cx="40" cy="26" r="17" />
          <path d="M6 80c0-20 15-31 34-31s34 11 34 31z" />
        </svg>
        <span
          style={{ position: "absolute", bottom: 2, fontFamily: "Anton", fontSize: 40, lineHeight: 1, color: ogColors.paper }}
        >
          {initials}
        </span>
      </div>
      <span style={{ marginTop: 12, fontFamily: "Anton", fontSize: 30, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {name}
      </span>
    </div>
  );
}

function ConfidentialStamp() {
  return (
    <div
      style={{
        position: "absolute",
        top: 74,
        left: 34,
        display: "flex",
        padding: 5,
        border: `6px solid ${ogColors.accent}`,
        mixBlendMode: "multiply",
        transform: "rotate(-9deg)",
      }}
    >
      <span
        style={{
          padding: "6px 18px 2px",
          border: `2px solid ${ogColors.accent}`,
          fontFamily: "Anton",
          fontSize: 58,
          lineHeight: 1,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: ogColors.accent,
        }}
      >
        Confidencial
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ height: 8, borderTop: `2px solid ${ogColors.ink}`, borderBottom: `4px solid ${ogColors.ink}` }} />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 34, color: ogColors.ink2 }}>
          {siteTagline}
        </span>
        <span style={{ fontFamily: "Special Elite", fontSize: 22, color: ogColors.mute }}>{new URL(siteUrl).host}</span>
      </div>
    </div>
  );
}
