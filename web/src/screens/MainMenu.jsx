import HeroCard from "../components/HeroCard.jsx";
import MenuButton from "../components/MenuButton.jsx";

export const MENU = [
  { id: "adventure", icon: "⚔️", label: "Adventure", hint: "Venture into the wilds", locked: true },
  { id: "character", icon: "🛡️", label: "Character", hint: "Your hero and stats" },
  { id: "inventory", icon: "🎒", label: "Inventory", hint: "Items and gear", locked: true },
  { id: "quests", icon: "📜", label: "Quests", hint: "Tasks and rewards", locked: true },
  { id: "journal", icon: "📖", label: "Journal", hint: "Write down your tale" },
  { id: "guild", icon: "🏰", label: "Guild Hall", hint: "Fellow travelers" },
];

export default function MainMenu({ user, status, onOpen }) {
  return (
    <>
      <header className="mb-5 text-center">
        <p className="font-display text-xs tracking-[0.4em] text-muted uppercase">The realm of</p>
        <h1 className="title-glow font-display text-4xl font-black tracking-[0.15em] text-gold-light">VAELORN</h1>
        <div className="mx-auto mt-2 h-px w-40 bg-linear-to-r from-transparent via-gold to-transparent" />
        {status && <p className="mt-3 text-sm text-muted">{status}</p>}
      </header>

      {user && <HeroCard user={user} />}

      <nav className="mt-4 grid gap-2.5">
        {MENU.map((item) => (
          <MenuButton key={item.id} {...item} onClick={() => onOpen(item.id)} />
        ))}
      </nav>
    </>
  );
}
