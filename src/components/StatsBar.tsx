type StatsBarProps = {
  wpm: number;
  accuracy: number;
  typoCount: number;
  elapsedLabel: string;
  characterProgress: string;
};

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard(props: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">{props.label}</p>
      <p className="mt-2 text-xl font-semibold text-text-main">{props.value}</p>
    </div>
  );
}

export function StatsBar(props: StatsBarProps) {
  return (
    <section className="grid gap-3 rounded-[28px] border border-white/10 bg-panel/75 p-4 shadow-panel backdrop-blur sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="WPM" value={props.wpm.toFixed(1)} />
      <StatCard label="Accuracy" value={`${props.accuracy.toFixed(1)}%`} />
      <StatCard label="Typos" value={props.typoCount.toString()} />
      <StatCard label="Elapsed" value={props.elapsedLabel} />
      <StatCard label="Progress" value={props.characterProgress} />
    </section>
  );
}
