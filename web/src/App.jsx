import { useEffect, useState } from "react";
import { startSession } from "./api.js";
import GameScreen from "./screens/GameScreen.jsx";
import TitleScreen from "./screens/TitleScreen.jsx";
import { isInTelegram, setupTelegram, tg } from "./telegram.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("title");

  useEffect(() => {
    setupTelegram();
    if (!isInTelegram) return;
    startSession()
      .then((data) => setUser(data.user))
      .catch(() => setError("OFFLINE MODE"));
  }, []);

  // Telegram's native back button returns to the title screen.
  useEffect(() => {
    if (!isInTelegram) return;
    const goBack = () => setScreen("title");
    if (screen === "title") tg.BackButton.hide();
    else tg.BackButton.show();
    tg.BackButton.onClick(goBack);
    return () => tg.BackButton.offClick(goBack);
  }, [screen]);

  const playerName = user?.first_name ?? tg?.initDataUnsafe?.user?.first_name;

  return screen === "title" ? (
    <TitleScreen playerName={playerName} status={error} onStart={() => setScreen("game")} />
  ) : (
    <GameScreen playerName={playerName} showExit={!isInTelegram} onExit={() => setScreen("title")} />
  );
}
