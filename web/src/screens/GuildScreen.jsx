import Panel from "../components/Panel.jsx";

function Stat({ value, label }) {
  return (
    <div className="rounded-md border border-gold/30 bg-night/50 p-3 text-center">
      <div className="font-display text-3xl font-bold text-gold-light tabular-nums">{value ?? "–"}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

export default function GuildScreen({ stats }) {
  return (
    <Panel title="Guild Hall">
      <p className="mb-4 text-center text-muted">Travelers who have entered the realm.</p>
      <div className="grid grid-cols-2 gap-3">
        <Stat value={stats?.totalUsers} label="Members" />
        <Stat value={stats?.activeToday} label="Active today" />
      </div>
    </Panel>
  );
}
