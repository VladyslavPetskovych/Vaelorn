// 8×8 sprites as strings: one character per pixel, "." is transparent.
export const TILE = 8;

export const PALETTE = {
  k: "#1a1c2c", // outline
  h: "#73464c", // hair
  s: "#f4c8a0", // skin
  b: "#3b5dc9", // tunic
  B: "#29366f", // tunic shade
  l: "#333c57", // boots
  T: "#257179", // leaves
  t: "#38b764", // leaf highlight
  w: "#5d275d", // trunk
  y: "#ffcd75", // flower
  r: "#b13e53", // flower
};

export const SPRITES = {
  hero: [
    "..hhhh..",
    ".hhhhhh.",
    ".hskskh.",
    "..ssss..",
    ".bbBbbb.",
    "s.bbbb.s",
    "..BBBB..",
    "..l..l..",
  ],
  heroStep: [
    "..hhhh..",
    ".hhhhhh.",
    ".hskskh.",
    "..ssss..",
    ".bbBbbb.",
    "s.bbbb.s",
    "..BBBB..",
    "...ll...",
  ],
  tree: [
    "..TTTT..",
    ".TTtTTT.",
    "TTttTTTT",
    "TtTTTTtT",
    ".TTTTTT.",
    "..TTTT..",
    "...ww...",
    "..wwww..",
  ],
  flowerY: [
    "........",
    "........",
    "...y....",
    "..yky...",
    "...y....",
    "...t....",
    "........",
    "........",
  ],
  flowerR: [
    "........",
    "........",
    "....r...",
    "...rkr..",
    "....r...",
    "....t...",
    "........",
    "........",
  ],
};

export function drawSprite(ctx, sprite, x, y, { flip = false } = {}) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = PALETTE[sprite[row][flip ? TILE - 1 - col : col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col, y + row, 1, 1);
    }
  }
}
