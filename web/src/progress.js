// Placeholder progression until real gameplay exists: every app visit is 10 XP,
// and level N needs N * 50 XP to reach the next one.
const XP_PER_VISIT = 10;
const xpForLevel = (level) => level * 50;

export function getProgress(visits = 0) {
  let xp = visits * XP_PER_VISIT;
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
  }
  return { level, xp, xpToNext: xpForLevel(level) };
}
