import Link from "next/link";
import { Ficha, fichaClasses } from "@/components/game/Ficha";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeStamp } from "@/components/home/HomeStamp";
import { buttonVariants } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Tape } from "@/components/ui/Tape";
import { answerOptions } from "@/data/politicians";
import { cn } from "@/lib/cn";
import { riseAt } from "@/lib/rise";

const tapeItems = ["Última hora", "Edição extra", "Você também vai errar", "Sem foto, sem desculpa"];

const suspects = answerOptions.filter((option) => option.id !== "ambos");

const suspectTilts = ["-rotate-[2.5deg]", "rotate-[1.2deg] -translate-y-1.5"];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col pb-8">
      <Tape items={tapeItems} style={riseAt(0.05)} className="rise mt-2 -rotate-[1.4deg] scale-[1.04]" />

      <header className="px-5 pt-5">
        <p
          style={riseAt(0.15)}
          className="rise flex justify-between border-t border-b border-ink py-1.5 font-label text-[10px] leading-none font-medium tracking-[0.2em] uppercase"
        >
          <span>Brasília</span>
          <span>Edição extra · Nº 1</span>
          <span>R$ 0,00</span>
        </p>
        <h1
          style={riseAt(0.25)}
          className="rise mt-3.5 mb-2.5 text-center font-display text-[70px] leading-[0.86] tracking-[-0.005em] uppercase"
        >
          Quem fez
          <span className="block text-accent after:stamp-mask after:-mt-0.5 after:block after:h-2.5 after:w-full after:bg-accent after:content-['']">
            isso?
          </span>
        </h1>
        <div style={riseAt(0.3)} className="rise h-[5px] border-t border-b-[3px] border-ink" />
      </header>

      <p
        style={riseAt(0.4)}
        className="rise px-6 pt-3 text-center font-body text-[17px] leading-snug font-medium text-ink-2 italic text-balance"
      >
        Uma atitude. Dois lados. Descubra se você{" "}
        <strong className="bg-[linear-gradient(transparent_55%,rgba(196,18,28,0.35)_55%)] font-bold text-ink not-italic">
          reconhece o seu
        </strong>
        .
      </p>

      <p style={riseAt(0.5)} className="rise px-6 pt-4 font-body text-[15px] leading-snug text-pretty">
        Você vai ler 10 atitudes polêmicas sem saber de quem são. Adivinhe se foi Lula, um Bolsonaro, ou se os dois
        lados fizeram a mesma coisa. No fim, a gente mostra o que você só enxerga no político dos outros.
      </p>

      <section className="relative px-5 pt-5">
        <Kicker style={riseAt(0.6)} className="rise mb-5">
          Os suspeitos
        </Kicker>
        <ul className="grid grid-cols-2 gap-3">
          {suspects.map((option, index) => (
            <li
              key={option.id}
              style={riseAt(0.7 + index * 0.12)}
              className={cn(fichaClasses, "rise px-2 pt-2.5 pb-2", suspectTilts[index])}
            >
              <Ficha option={option} />
            </li>
          ))}
        </ul>
        <HomeStamp />
      </section>

      <div className="px-5 pt-8">
        <Link
          href="/jogar"
          style={riseAt(1)}
          className={cn(buttonVariants({ variant: "ink", size: "lg" }), "rise w-full flex-col gap-2")}
        >
          Começar a rodada
          <small className="font-label text-[10px] leading-none font-medium tracking-[0.2em] text-paper-3">
            10 atitudes · 2 lados · 0 desculpas
          </small>
        </Link>
      </div>

      <div style={riseAt(1.1)} className="rise flex flex-col items-center gap-1 px-5 pt-5 text-center">
        <HomeStats />
        <p className="font-type text-[11px] leading-relaxed text-ink-2">Nenhum político saiu ileso desta edição.</p>
      </div>

      <footer
        style={riseAt(1.2)}
        className="rise mx-5 mt-auto flex justify-between border-t border-ink pt-2 font-label text-[9px] leading-none font-medium tracking-[0.22em] text-mute uppercase"
      >
        <span>Ano I</span>
        <span>Vale o que está escrito</span>
        <span>Pág. 1</span>
      </footer>
    </main>
  );
}
