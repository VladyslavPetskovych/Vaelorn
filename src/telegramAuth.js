import crypto from "node:crypto";

const MAX_AGE_SECONDS = 24 * 60 * 60;

// Validates Telegram Mini App initData:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
// Returns the Telegram user object, or null if the data is missing, forged or expired.
export function validateInitData(initData, botToken) {
  if (typeof initData !== "string" || !initData) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) return null;

  try {
    return JSON.parse(params.get("user"));
  } catch {
    return null;
  }
}
