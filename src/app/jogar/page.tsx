import type { Metadata } from "next";
import { Game } from "@/components/game/Game";

export const metadata: Metadata = {
  title: "Jogar",
};

export default function PlayPage() {
  return (
    <main className="flex flex-1 flex-col px-5 pt-5 pb-8">
      <Game />
    </main>
  );
}
