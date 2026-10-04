import { getProgress } from "../progress.js";
import Bar from "./Bar.jsx";

export default function HeroCard({ user }) {
  const { level, xp, xpToNext } = getProgress(user?.visits);
  const initial = (user?.first_name || "?").charAt(0).toUpperCase();

  return (
    <div className="rpg-frame flex items-center gap-3 p-3">
      <div className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-gold bg-night font-display text-2xl font-bold text-gold-light">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-display font-bold text-parchment">{user?.first_name || "Traveler"}</span>
          <span className="shrink-0 font-display text-sm text-gold-light">Lv {level}</span>
        </div>
        <Bar value={xp} max={xpToNext} label="XP" />
      </div>
    </div>
  );
}
