const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const fetchArticles = require("./fetcher");

const paraphraseContent = require("./paraphraser");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const YOUR_TELEGRAM_ID = process.env.YOUR_TELEGRAM_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const { hasBeenSent, markAsSent } = require("./sentCache");

const MAX_CAPTION_LENGTH = 1024;

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}
async function scheduledTask() {
  console.log("⏰ Scheduled task triggered");

  const articles = await fetchArticles();
  console.log(`✅ Fetched articles: ${articles.length}`);

  const latestUnsent = articles.find((article) => !hasBeenSent(article.url));
  if (!latestUnsent) {
    console.log("ℹ️ No new article found");
    return;
  }

  try {
    // Send to YOU
    await bot.sendMessage(
      YOUR_TELEGRAM_ID,
      `📰 Original article title:\n${latestUnsent.title}\n\n${latestUnsent.url}`
    );

    // Paraphrase title
    const paraphrasedTitle = await paraphraseContent(latestUnsent.title);
    const caption = truncateText(`📝${paraphrasedTitle}`, 1024);

    // Send to channel
    if (latestUnsent.image) {
      await bot.sendPhoto(CHANNEL_ID, latestUnsent.image, { caption });
    } else {
      await bot.sendMessage(CHANNEL_ID, caption);
    }

    markAsSent(latestUnsent.url);
    console.log(`📤 Sent: ${latestUnsent.title}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Schedule at 10 AM and 7 PM daily
function startScheduler() {
  cron.schedule("0 10,19 * * *", () => {
    scheduledTask();
    console.log("🔄 Scheduled task executed at 10 AM and 7 PM");
  });
  console.log("🤖 Scheduler started");
}

module.exports = { startScheduler };
