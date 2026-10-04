import { createClient } from "redis";
import { config } from "./config.js";

// Redis layout:
//   user:<id>         hash  – profile fields, first_seen, last_seen, visits, note
//   users             set   – every user id ever seen (SCARD = total users)
//   active:<date>     set   – user ids active on that UTC day (kept 90 days)

export const redis = createClient({ url: config.redisUrl });
redis.on("error", (err) => console.error("Redis error:", err.message));

const today = () => new Date().toISOString().slice(0, 10);
const ACTIVE_TTL_SECONDS = 90 * 24 * 60 * 60;

export async function trackUser(tgUser) {
  const key = `user:${tgUser.id}`;
  const now = new Date().toISOString();
  const activeKey = `active:${today()}`;

  await redis
    .multi()
    .hSetNX(key, "first_seen", now)
    .hSet(key, {
      id: String(tgUser.id),
      first_name: tgUser.first_name ?? "",
      last_name: tgUser.last_name ?? "",
      username: tgUser.username ?? "",
      language_code: tgUser.language_code ?? "",
      is_premium: tgUser.is_premium ? "1" : "0",
      last_seen: now,
    })
    .hIncrBy(key, "visits", 1)
    .sAdd("users", String(tgUser.id))
    .sAdd(activeKey, String(tgUser.id))
    .expire(activeKey, ACTIVE_TTL_SECONDS)
    .exec();

  return getUser(tgUser.id);
}

export async function getUser(id) {
  const data = await redis.hGetAll(`user:${id}`);
  if (!data.id) return null;
  return { ...data, visits: Number(data.visits ?? 0), is_premium: data.is_premium === "1" };
}

export async function saveNote(id, note) {
  await redis.hSet(`user:${id}`, "note", note);
}

export async function getStats() {
  const [totalUsers, activeToday] = await Promise.all([
    redis.sCard("users"),
    redis.sCard(`active:${today()}`),
  ]);
  return { totalUsers, activeToday };
}
