import Bar from "../components/Bar.jsx";
import Panel from "../components/Panel.jsx";
import { getProgress } from "../progress.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "–");

export default function CharacterScreen({ user }) {
  const { level, xp, xpToNext } = getProgress(user?.visits);
  const rows = [
    ["Name", [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "–"],
    ["Title", user?.username ? `@${user.username}` : "Wanderer"],
    ["Level", level],
    ["Visits", user?.visits ?? 0],
    ["Joined", formatDate(user?.first_seen)],
    ["Rank", user?.is_premium ? "⭐ Noble" : "Commoner"],
  ];

  return (
    <div className="grid gap-4">
      <Panel title="Character">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
      <Panel title="Vitals">
        <div className="grid gap-3">
          <Bar label="Health" value={100} max={100} color="bg-ember" />
          <Bar label="Mana" value={50} max={50} color="bg-mana" />
          <Bar label="Experience" value={xp} max={xpToNext} />
        </div>
      </Panel>
    </div>
  );
}
