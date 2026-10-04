import path from "node:path";
import express from "express";
import { config } from "./config.js";
import { getStats, getUser, saveNote, trackUser } from "./store.js";
import { validateInitData } from "./telegramAuth.js";

const MAX_NOTE_LENGTH = 500;

export function createApi() {
  const app = express();
  app.use(express.json({ limit: "16kb" }));

  // Every user endpoint takes { initData } in the body; reject anything Telegram didn't sign.
  const auth = (req, res, next) => {
    const user = validateInitData(req.body?.initData, config.botToken);
    if (!user?.id) return res.status(401).json({ error: "Invalid Telegram init data" });
    req.tgUser = user;
    next();
  };

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.get("/api/stats", async (_req, res) => res.json(await getStats()));

  // Called when the Mini App opens: records the visit, returns profile + stats.
  app.post("/api/session", auth, async (req, res) => {
    const [user, stats] = await Promise.all([trackUser(req.tgUser), getStats()]);
    res.json({ user, stats });
  });

  app.post("/api/note", auth, async (req, res) => {
    const note = String(req.body.note ?? "").slice(0, MAX_NOTE_LENGTH);
    await saveNote(req.tgUser.id, note);
    res.json({ user: await getUser(req.tgUser.id) });
  });

  // Serves the Mini App too, so the server works on its own (handy for local testing).
  app.use(express.static(path.resolve("webapp")));

  app.use((err, _req, res, _next) => {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal error" });
  });

  return app;
}
