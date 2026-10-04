import { useEffect, useRef } from "react";
import { SPRITES, drawSprite } from "../game/sprites.js";
import { haptic } from "../telegram.js";

const STARS = [
  [8, 20, 0], [22, 70, 0.4], [35, 12, 0.8], [48, 85, 0.2], [62, 30, 0.6],
  [75, 65, 0.1], [88, 18, 0.9], [15, 50, 0.5], [92, 80, 0.3], [55, 55, 0.7],
];

function HeroPortrait() {
  const ref = useRef(null);
  useEffect(() => drawSprite(ref.current.getContext("2d"), SPRITES.hero, 0, 0), []);
  return <canvas ref={ref} width={8} height={8} className="animate-bob size-24" />;
}

export default function TitleScreen({ playerName, status, onStart }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-4 pt-12 pb-10 text-center">
      {/* Stepped "pixel" sky and ground bands. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(#1a1c2c 0 30%, #29366f 30% 50%, #3b5dc9 50% 62%, #41a6f6 62% 70%, #38b764 70% 74%, #257179 74% 100%)",
        }}
      />

      {/* Twinkling pixel stars in the night band. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30%] -z-10">
        {STARS.map(([x, y, delay], i) => (
          <span
            key={i}
            className="animate-blink absolute size-1 bg-snow"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div>
        <h1 className="text-pixel-shadow text-4xl leading-tight text-sun">VAELORN</h1>
        <p className="mt-4 text-[10px] tracking-widest text-steel">A PIXEL ADVENTURE</p>
      </div>

      <HeroPortrait />

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => {
            haptic("medium");
            onStart();
          }}
          className="pixel-button text-sm"
        >
          ▶ Start game
        </button>
        <p className="text-pixel-shadow min-h-4 text-[10px] leading-relaxed text-snow">
          {status ?? (playerName ? `PLAYER: ${playerName.toUpperCase()}` : "")}
        </p>
      </div>
    </div>
  );
}
