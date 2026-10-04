import { useEffect, useState } from "react";
import { startSession } from "./api.js";
import NoteCard from "./components/NoteCard.jsx";
import StatCard from "./components/StatCard.jsx";
import { isInTelegram, tg } from "./telegram.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isInTelegram) return;
    tg.ready();
    tg.expand();
    startSession()
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
      })
      .catch((err) => setError(`Couldn't reach the server: ${err.message}`));
  }, []);

  const subtitle = !isInTelegram
    ? "Open this page from the Vaelorn bot in Telegram."
    : error || (user ? (user.username ? `@${user.username}` : "Welcome to Vaelorn") : "Loading…");

  return (
    <main className="mx-auto max-w-md px-4 pt-5 pb-8">
      <header>
        <h1 className="text-2xl font-bold">{user ? `Hi, ${user.first_name || "there"}!` : "Vaelorn"}</h1>
        <p className="text-sm text-tg-hint">{subtitle}</p>
      </header>

      <section className="my-5 grid grid-cols-3 gap-2">
        <StatCard value={stats?.totalUsers} label="total users" />
        <StatCard value={stats?.activeToday} label="active today" />
        <StatCard value={user?.visits} label="your visits" />
      </section>

      <NoteCard initialNote={user?.note} disabled={!user} onSaved={setUser} />
    </main>
  );
}
