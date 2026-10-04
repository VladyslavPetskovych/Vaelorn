export default function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-tg-card px-2 py-3.5">
      <span className="text-2xl font-semibold tabular-nums">{value ?? "–"}</span>
      <span className="text-xs text-tg-hint">{label}</span>
    </div>
  );
}
