import { Bot, InlineKeyboard } from "grammy";
import { config } from "./config.js";
import { getStats, trackUser } from "./store.js";

// Telegram only opens Mini Apps over HTTPS.
const hasWebApp = config.webAppUrl.startsWith("https://");

export const bot = new Bot(config.botToken);

bot.command("start", async (ctx) => {
  if (ctx.from) await trackUser(ctx.from);
  const keyboard = hasWebApp ? new InlineKeyboard().webApp("Open Vaelorn", config.webAppUrl) : undefined;
  await ctx.reply(`Hi ${ctx.from?.first_name ?? "there"}! I'm Vaelorn.`, { reply_markup: keyboard });
});

bot.command("help", (ctx) =>
  ctx.reply("/start - open the app\n/stats - user numbers\n/help - this message"),
);

bot.command("stats", async (ctx) => {
  const { totalUsers, activeToday } = await getStats();
  await ctx.reply(`Total users: ${totalUsers}\nActive today: ${activeToday}`);
});

bot.catch((err) => console.error("Bot error:", err));

export async function startBot() {
  await bot.api.setMyCommands([
    { command: "start", description: "Open the app" },
    { command: "stats", description: "User numbers" },
    { command: "help", description: "Show help" },
  ]);
  if (hasWebApp) {
    await bot.api.setChatMenuButton({
      menu_button: { type: "web_app", text: "Open app", web_app: { url: config.webAppUrl } },
    });
  } else {
    console.warn("WEBAPP_URL is not an https:// URL – the Mini App button is disabled.");
  }
  bot.start({ onStart: (me) => console.log(`@${me.username} is running`) });
}
