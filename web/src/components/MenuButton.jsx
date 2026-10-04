import { haptic } from "../telegram.js";

export default function MenuButton({ icon, label, hint, onClick, locked = false }) {
  return (
    <button
      onClick={() => {
        haptic();
        onClick();
      }}
      className="rpg-frame group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:border-gold-light active:translate-y-px active:brightness-90"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-gold/40 bg-night/60 text-xl">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-display text-base font-bold tracking-wider text-gold-light">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
      <span className={`text-gold/70 transition group-hover:translate-x-0.5 ${locked ? "text-sm opacity-70" : "font-display text-3xl leading-none"}`}>
        {locked ? "🔒" : "›"}
      </span>
    </button>
  );
}
