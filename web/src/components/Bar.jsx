export default function Bar({ value, max, color = "bg-gold", label }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="tabular-nums">{value}/{max}</span>
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full border border-gold/40 bg-night">
        <div className={`h-full ${color} transition-[width] duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
