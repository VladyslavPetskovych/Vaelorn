import { tg } from "./telegram.js";

// Relative path: Netlify proxies /api/* to the server; Vite proxies it in local dev.
async function post(path, body) {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg?.initData, ...body }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json();
}

export const startSession = () => post("/session");
export const saveNote = (note) => post("/note", { note });
