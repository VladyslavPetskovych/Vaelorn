import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not set. Copy .env.example to .env and add your token.");
  process.exit(1);
}

const bot = new Bot(token);

bot.command("start", (ctx) =>
  ctx.reply(`Hi ${ctx.from?.first_name ?? "there"}! I'm Vaelorn. Send /help to see what I can do.`),
);

bot.command("help", (ctx) =>
  ctx.reply("/start - greeting\n/help - this message\nAny other text - I'll echo it back."),
);

bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));

bot.catch((err) => console.error("Bot error:", err));

await bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help" },
]);

bot.start({ onStart: (me) => console.log(`@${me.username} is running`) });
