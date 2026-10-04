import { useState } from "react";
import GameCanvas from "../game/GameCanvas.jsx";

export default function GameScreen({ playerName, onExit, showExit }) {
  const [steps, setSteps] = useState(0);

  return (
    <div className="flex h-full flex-col items-center gap-4 px-4 pt-6">
      <div className="flex w-full max-w-md items-center justify-between text-[10px]">
        <span className="text-sun">{(playerName || "HERO").toUpperCase()}</span>
        <span className="tabular-nums">STEPS {String(steps).padStart(4, "0")}</span>
      </div>

      <div className="border-4 border-ink shadow-[0_0_0_4px_#566c86]">
        <GameCanvas onStep={() => setSteps((s) => s + 1)} />
      </div>

      <p className="animate-blink text-[10px] text-steel">TAP TO MOVE</p>

      {/* Inside Telegram the native back button does this. */}
      {showExit && (
        <button onClick={onExit} className="text-[10px] text-steel underline">
          ◀ TITLE
        </button>
      )}
    </div>
  );
}
