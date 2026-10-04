import { Bot, InlineKeyboard } from "grammy";
import { config } from "./config.js";
import { getStats, trackUser } from "./store.js";

// Telegram only opens Mini Apps over HTTPS.
const hasWebApp = config.webAppUrl.startsWith("https://");
const menuButton = { type: "web_app", text: "Play", web_app: { url: config.webAppUrl } };

export const bot = new Bot(config.botToken);

bot.command("start", async (ctx) => {
  if (ctx.from) await trackUser(ctx.from);
  if (!hasWebApp) return ctx.reply(`Hi ${ctx.from?.first_name ?? "there"}! I'm Vaelorn.`);

  // Set per chat as well: the bot-wide default doesn't always reach existing chats.
  await ctx.api.setChatMenuButton({ chat_id: ctx.chat.id, menu_button: menuButton }).catch(() => {});
  await ctx.reply(`Welcome to the realm of Vaelorn, ${ctx.from?.first_name ?? "traveler"}! ⚔️`, {
    reply_markup: new InlineKeyboard().webApp("🏰 Enter Vaelorn", config.webAppUrl),
  });
});

bot.command("play", async (ctx) => {
  if (!hasWebApp) return ctx.reply("The realm isn't open yet.");
  await ctx.reply("The gates are open.", {
    reply_markup: new InlineKeyboard().webApp("🏰 Enter Vaelorn", config.webAppUrl),
  });
});

bot.command("help", (ctx) =>
  ctx.reply("/play - open the game\n/stats - user numbers\n/help - this message"),
);

bot.command("stats", async (ctx) => {
  const { totalUsers, activeToday } = await getStats();
  await ctx.reply(`Total users: ${totalUsers}\nActive today: ${activeToday}`);
});

bot.catch((err) => console.error("Bot error:", err));

export async function startBot() {
  await bot.api.setMyCommands([
    { command: "play", description: "Open the game" },
    { command: "stats", description: "User numbers" },
    { command: "help", description: "Show help" },
  ]);
  if (hasWebApp) {
    await bot.api.setChatMenuButton({ menu_button: menuButton });
  } else {
    console.warn("WEBAPP_URL is not an https:// URL – the Mini App button is disabled.");
  }
  bot.start({ onStart: (me) => console.log(`@${me.username} is running`) });
}
