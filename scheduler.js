const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const fetchArticles = require("./fetcher");
const paraphraseContent = require("./paraphraser");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const YOUR_TELEGRAM_ID = process.env.YOUR_TELEGRAM_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

async function scheduledTask() {
  console.log("⏰ Scheduled task triggered");

  const articles = await fetchArticles();
  console.log(`✅ Fetched articles: ${articles.length}`);

  for (const article of articles.slice(0, 2)) {
    try {
      // Send original to you
      await bot.sendMessage(
        YOUR_TELEGRAM_ID,
        `📰 Original article title:\n${article.title}\n\n${article.url}`
      );

      // Paraphrase and send to channel
      const paraphrased = await paraphraseContent(
        article.content || article.title
      );
      await bot.sendMessage(
        CHANNEL_ID,
        `📝 Paraphrased article:\n${paraphrased}`
      );

      console.log(`📤 Message sent for article: ${article.title}`);
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
    }
  }
}

// Schedule at 2 PM and 7 PM daily
function startScheduler() {
  cron.schedule("0 14,19 * * *", () => {
    scheduledTask();
    console.log("🔄 Scheduled task executed at 2 PM and 7 PM");
  });
  console.log("🤖 Scheduler started");
}

module.exports = { startScheduler };
