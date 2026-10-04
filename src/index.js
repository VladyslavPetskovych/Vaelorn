import { createApi } from "./api.js";
import { bot, startBot } from "./bot.js";
import { config } from "./config.js";
import { redis } from "./store.js";

await redis.connect();
console.log("Connected to Redis");

const server = createApi().listen(config.port, () => console.log(`API listening on :${config.port}`));
await startBot();

async function shutdown() {
  await bot.stop();
  server.close();
  await redis.quit();
  process.exit(0);
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
