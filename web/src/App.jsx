import { useEffect, useState } from "react";
import { startSession } from "./api.js";
import CharacterScreen from "./screens/CharacterScreen.jsx";
import ComingSoon from "./screens/ComingSoon.jsx";
import GuildScreen from "./screens/GuildScreen.jsx";
import JournalScreen from "./screens/JournalScreen.jsx";
import MainMenu, { MENU } from "./screens/MainMenu.jsx";
import { applyTheme, isInTelegram, tg } from "./telegram.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState("menu");

  useEffect(() => {
    if (!isInTelegram) return;
    tg.ready();
    tg.expand();
    applyTheme();
    startSession()
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
      })
      .catch((err) => setError(`The path is blocked: ${err.message}`));
  }, []);

  // Telegram's native back button returns to the main menu.
  useEffect(() => {
    if (!isInTelegram) return;
    const goBack = () => setScreen("menu");
    if (screen === "menu") tg.BackButton.hide();
    else tg.BackButton.show();
    tg.BackButton.onClick(goBack);
    return () => tg.BackButton.offClick(goBack);
  }, [screen]);

  const status = !isInTelegram
    ? "Open this realm from the Vaelorn bot in Telegram."
    : error || (user ? `Welcome back, ${user.first_name || "traveler"}.` : "Opening the gates…");

  const item = MENU.find((m) => m.id === screen);

  return (
    <main className="mx-auto max-w-md px-4 pt-6 pb-10">
      {screen === "menu" ? (
        <MainMenu user={user} status={status} onOpen={setScreen} />
      ) : (
        <>
          {/* Inside Telegram the native back button does this. */}
          {!isInTelegram && (
            <button onClick={() => setScreen("menu")} className="mb-3 font-display text-sm text-gold">
              ‹ Back
            </button>
          )}
          {screen === "character" && <CharacterScreen user={user} />}
          {screen === "journal" && <JournalScreen user={user} onSaved={setUser} />}
          {screen === "guild" && <GuildScreen stats={stats} />}
          {item?.locked && <ComingSoon item={item} />}
        </>
      )}
    </main>
  );
}
