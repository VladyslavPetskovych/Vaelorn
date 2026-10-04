// A small fixed map (Game Boy-sized: 20×18 tiles of 8px = 160×144).
export const COLS = 20;
export const ROWS = 18;

export const GRASS = 0;
export const TREE = 1;
export const WATER = 2;
export const FLOWER_Y = 3;
export const FLOWER_R = 4;

const BLOCKING = new Set([TREE, WATER]);

// Deterministic random so the map is the same for every player.
function seeded(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function createWorld() {
  const rand = seeded(7);
  const tiles = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) return TREE;
      const r = rand();
      if (r < 0.07) return TREE;
      if (r < 0.1) return FLOWER_Y;
      if (r < 0.12) return FLOWER_R;
      return GRASS;
    }),
  );

  // A pond in the upper right.
  for (let y = 3; y <= 6; y++) {
    for (let x = 12; x <= 16; x++) {
      const corner = (y === 3 || y === 6) && (x === 12 || x === 16);
      if (!corner) tiles[y][x] = WATER;
    }
  }

  const spawn = { x: 6, y: 10 };
  tiles[spawn.y][spawn.x] = GRASS;

  return { tiles, spawn };
}

export function isWalkable(world, x, y) {
  return x >= 0 && y >= 0 && x < COLS && y < ROWS && !BLOCKING.has(world.tiles[y][x]);
}

// Breadth-first search; returns the tiles to step through (excluding the start), or [] if unreachable.
export function findPath(world, from, to) {
  if (!isWalkable(world, to.x, to.y)) return [];
  const key = (p) => p.y * COLS + p.x;
  const cameFrom = new Map([[key(from), null]]);
  const queue = [from];

  while (queue.length) {
    const current = queue.shift();
    if (current.x === to.x && current.y === to.y) {
      const path = [];
      for (let p = current; p && key(p) !== key(from); p = cameFrom.get(key(p))) path.unshift(p);
      return path;
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: current.x + dx, y: current.y + dy };
      if (!cameFrom.has(key(next)) && isWalkable(world, next.x, next.y)) {
        cameFrom.set(key(next), current);
        queue.push(next);
      }
    }
  }
  return [];
}
