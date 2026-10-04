import { useEffect, useRef } from "react";
import { haptic } from "../telegram.js";
import { SPRITES, TILE, drawSprite } from "./sprites.js";
import { COLS, FLOWER_R, FLOWER_Y, ROWS, TREE, WATER, createWorld, findPath, isWalkable } from "./world.js";

const WIDTH = COLS * TILE;
const HEIGHT = ROWS * TILE;
const SPEED = 40; // pixels per second
const STEP_FRAME_SECONDS = 0.15;

// Static layer (grass, trees, flowers) is drawn once; water and the hero are drawn every frame.
function renderMap(world) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = "#38b764";
      ctx.fillRect(px, py, TILE, TILE);
      // Two grass blades per tile, placed by a hash so tiles don't look identical.
      const h = (x * 73 + y * 151) % 64;
      ctx.fillStyle = "#a7f070";
      ctx.fillRect(px + (h % 7), py + ((h >> 3) % 7), 1, 1);
      ctx.fillRect(px + ((h + 3) % 7), py + ((h + 5) % 7), 1, 1);

      const tile = world.tiles[y][x];
      if (tile === TREE) drawSprite(ctx, SPRITES.tree, px, py);
      if (tile === FLOWER_Y) drawSprite(ctx, SPRITES.flowerY, px, py);
      if (tile === FLOWER_R) drawSprite(ctx, SPRITES.flowerR, px, py);
    }
  }
  return canvas;
}

function drawWater(ctx, world, time) {
  const wave = Math.floor(time * 4) % TILE;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (world.tiles[y][x] !== WATER) continue;
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = "#3b5dc9";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#41a6f6";
      ctx.fillRect(px + ((wave + x * 3) % TILE), py + 2, 3, 1);
      ctx.fillRect(px + ((wave + x * 3 + 4) % TILE), py + 5, 3, 1);
    }
  }
}

function drawTargetMarker(ctx, target, time) {
  if (!target) return;
  const inset = Math.floor(time * 4) % 2;
  ctx.strokeStyle = "#ffcd75";
  ctx.lineWidth = 1;
  ctx.strokeRect(target.x * TILE + 0.5 + inset, target.y * TILE + 0.5 + inset, TILE - 1 - inset * 2, TILE - 1 - inset * 2);
}

export default function GameCanvas({ onStep }) {
  const canvasRef = useRef(null);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const world = createWorld();
    const mapLayer = renderMap(world);

    const hero = {
      tile: { ...world.spawn },
      px: world.spawn.x * TILE,
      py: world.spawn.y * TILE,
      path: [],
      target: null,
      flip: false,
      moving: false,
      stepTimer: 0,
      stepFrame: false,
    };

    // Tile the hero stands on, or the one it's currently walking into.
    const origin = () => hero.path[0] ?? hero.tile;

    function walkTo(target) {
      const from = origin();
      const rest = findPath(world, from, target);
      if (!rest.length && !(from.x === target.x && from.y === target.y)) return;
      hero.path = hero.path.length ? [hero.path[0], ...rest] : rest;
      hero.target = target;
      haptic("soft");
    }

    function update(dt) {
      const next = hero.path[0];
      hero.moving = Boolean(next);
      if (!next) {
        hero.target = null;
        return;
      }
      const tx = next.x * TILE;
      const ty = next.y * TILE;
      if (tx !== hero.px) hero.flip = tx < hero.px;
      const step = SPEED * dt;
      hero.px += Math.sign(tx - hero.px) * Math.min(step, Math.abs(tx - hero.px));
      hero.py += Math.sign(ty - hero.py) * Math.min(step, Math.abs(ty - hero.py));

      hero.stepTimer += dt;
      if (hero.stepTimer >= STEP_FRAME_SECONDS) {
        hero.stepTimer = 0;
        hero.stepFrame = !hero.stepFrame;
      }

      if (hero.px === tx && hero.py === ty) {
        hero.tile = hero.path.shift();
        onStepRef.current?.();
      }
    }

    function draw(time) {
      ctx.drawImage(mapLayer, 0, 0);
      drawWater(ctx, world, time);
      drawTargetMarker(ctx, hero.target, time);
      const sprite = hero.moving && hero.stepFrame ? SPRITES.heroStep : SPRITES.hero;
      // Idle breathing: lift the hero 1px every other half-second.
      const idleBob = !hero.moving && Math.floor(time * 2) % 2 ? -1 : 0;
      drawSprite(ctx, sprite, Math.round(hero.px), Math.round(hero.py) + idleBob, { flip: hero.flip });
    }

    let last = performance.now();
    let frame = requestAnimationFrame(function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw(now / 1000);
      frame = requestAnimationFrame(loop);
    });

    function onPointerDown(e) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
      const y = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
      walkTo({ x, y });
    }

    const KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    function onKeyDown(e) {
      const dir = KEYS[e.key];
      if (!dir || hero.path.length) return;
      e.preventDefault();
      const target = { x: hero.tile.x + dir[0], y: hero.tile.y + dir[1] };
      if (dir[0]) hero.flip = dir[0] < 0;
      if (isWalkable(world, target.x, target.y)) walkTo(target);
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="block touch-none"
      style={{ width: `min(calc(100vw - 48px), calc((100dvh - 150px) * ${WIDTH / HEIGHT}), 640px)` }}
    />
  );
}
