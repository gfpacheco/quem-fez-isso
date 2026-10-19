"use client";

import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Stamp } from "@/components/ui/Stamp";
import type { Quote } from "@/data/types";
import type { Answer } from "@/game/reducer";
import { buildShareText } from "@/game/shareText";
import type { Summary } from "@/game/summary";
import { riseAt } from "@/lib/rise";
import { siteName } from "@/lib/site";
import { Breakdown } from "./Breakdown";
import { Scraps } from "./Scraps";
import { ShareButton } from "./ShareButton";

type ResultsProps = {
  summary: Summary;
  quotes: Quote[];
  answers: Answer[];
  onRestart: () => void;
};

const statClasses = "flex items-baseline justify-between font-label text-[10px] font-medium tracking-[0.22em] uppercase";

export function Results({ summary, quotes, answers, onRestart }: ResultsProps) {
  const shareText = buildShareText({ quotes, answers, summary });

  return (
    <div className="relative flex flex-1 flex-col gap-4">
      <Scraps />

      <header className="text-center">
        <div style={riseAt(0.05)} className="rise h-[5px] border-t border-b-[3px] border-ink" />
        <p style={riseAt(0.1)} className="rise pt-1.5 pb-1 font-display text-[22px] leading-none tracking-[0.04em] uppercase">
          Quem fez <span className="text-accent">isso?</span>
        </p>
        <p
          style={riseAt(0.15)}
          className="rise flex justify-between border-t border-b border-ink py-1.5 font-label text-[9px] leading-none font-medium tracking-[0.2em] uppercase"
        >
          <span>Edição de resultados</span>
          <span>{new Date().toLocaleDateString("pt-BR")}</span>
          <span>Tiragem: 1</span>
        </p>
      </header>

      <section className="relative">
        <p style={riseAt(0.3)} className="rise mb-1.5 font-label text-[11px] leading-none font-bold tracking-[0.3em] text-accent uppercase">
          Patente oficial do leitor
        </p>
        <h1 style={riseAt(0.4)} className="rise font-display text-[56px] leading-[0.86] tracking-[-0.005em] text-balance uppercase">
          {summary.rank.title}
        </h1>
        <p style={riseAt(0.55)} className="rise mt-2 font-body text-sm leading-snug font-medium text-ink-2 italic">
          {summary.rank.description}
        </p>
        <Stamp rotate={10} delay={1.9} className="top-0 right-0 px-2.5 pt-1 pb-0.5 text-[26px]">
          Extra!
        </Stamp>
      </section>

      <div className="grid grid-cols-[150px_1fr] items-stretch gap-3.5">
        <div
          style={riseAt(0.7)}
          className="rise relative -rotate-2 bg-ink px-3 pt-3.5 pb-2.5 text-center text-paper shadow-hard-accent-lg"
        >
          <span aria-hidden="true" className="halftone text-paper opacity-[0.12]" />
          <p className="flex items-baseline justify-center font-display text-[64px] leading-[0.9]">
            <AnimatedNumber value={summary.correct} />
            <span className="ml-1 text-[30px] text-paper-3">/{summary.total}</span>
          </p>
          <p className="mt-1.5 font-label text-[10px] leading-none font-medium tracking-[0.3em] text-paper-3 uppercase">
            Acertos
          </p>
        </div>

        <dl
          style={riseAt(0.85)}
          className="rise flex flex-col justify-between gap-1.5 border-t-[3px] border-b border-ink py-2"
        >
          <div className={statClasses}>
            <dt>Melhor sequência</dt>
            <dd className="font-display text-[22px] leading-none tracking-normal text-accent">🔥 {summary.bestStreak}</dd>
          </div>
          <div className={statClasses}>
            <dt>Pontos</dt>
            <dd className="font-display text-[22px] leading-none tracking-normal">{summary.score}</dd>
          </div>
          <div className={statClasses}>
            <dt>Os dois lados</dt>
            <dd className="font-display text-[22px] leading-none tracking-normal">
              {summary.byAnswer.ambos.correct}/{summary.byAnswer.ambos.total}
            </dd>
          </div>
        </dl>
      </div>

      <section style={riseAt(1)} className="rise border-t-[3px] border-b border-ink py-2.5">
        <Kicker align="left">A redação observa</Kicker>
        <p className="drop-cap mt-2 font-body text-[15px] leading-snug text-balance">{summary.insight}</p>
      </section>

      <div style={riseAt(1.1)} className="rise">
        <Breakdown quotes={quotes} answers={answers} byAnswer={summary.byAnswer} />
      </div>

      <pre
        style={riseAt(1.3)}
        className="rise relative mt-2 rotate-[0.8deg] border-[1.5px] border-ink bg-paper-2 px-3 py-2 font-type text-[11.5px] leading-relaxed whitespace-pre-line text-ink shadow-hard before:absolute before:-top-2 before:right-2.5 before:bg-ink before:px-1.5 before:pt-1 before:pb-0.5 before:font-label before:text-[9px] before:leading-none before:font-bold before:tracking-[0.26em] before:text-paper before:content-['PRÉVIA']"
      >
        {shareText}
      </pre>

      <div style={riseAt(1.45)} className="rise mt-auto grid grid-cols-[1fr_auto] gap-2.5">
        <ShareButton text={shareText} />
        <Button variant="outline" onClick={onRestart} className="text-center leading-tight">
          Jogar
          <br />
          de novo
        </Button>
      </div>

      <Link href="/" className={buttonVariants({ variant: "ghost", className: "self-center" })}>
        Voltar à capa de {siteName}
      </Link>
    </div>
  );
}
