export function RoundSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando rodada" className="flex flex-1 animate-pulse flex-col gap-5">
      <div className="h-14 border-b-[3px] border-ink/30" />
      <div className="h-52 -rotate-[1.4deg] bg-paper-2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-40 border-2 border-ink/20 bg-paper-2" />
        <div className="h-40 border-2 border-ink/20 bg-paper-2" />
      </div>
      <div className="h-16 border-2 border-dashed border-accent/30" />
    </div>
  );
}
