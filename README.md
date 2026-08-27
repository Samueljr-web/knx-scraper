# knx-scraper

A Telegram bot that fetches web3/blockchain news, paraphrases it, and posts it to a Telegram channel.

## How it works

1. **Fetch** — `fetcher.js` queries the [GNews API](https://gnews.io) for articles matching `web3 OR blockchain`.
2. **Dedupe** — `sentCache.js` checks `sent.json` for the article URL and skips anything already posted.
3. **Paraphrase** — `paraphraser.js` sends the article title to [OpenRouter](https://openrouter.ai) (`deepseek/deepseek-prover-v2:free`) to rewrite it and avoid copyright issues.
4. **Post** — `scheduler.js` sends the original title/link to your personal Telegram (for review), then posts the paraphrased title + image as a message to the target channel via `node-telegram-bot-api`.
5. **Mark as sent** — the article URL is appended to `sent.json` so it isn't reposted.

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
CHANNEL_ID=@your_channel
YOUR_TELEGRAM_ID=your-telegram-user-id
GNEWS_API_KEY=your-gnews-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

`.env` is gitignored — never commit it.

## Run

```bash
npm start
```

This runs `index.js`, which starts the scheduler. **Note:** the cron schedule in `scheduler.js` (`0 10,19 * * *` — 10 AM and 7 PM daily) is currently commented out; the task runs once immediately on startup instead. Uncomment the `cron.schedule(...)` block in `scheduler.js` to restore the twice-daily schedule.

## Files

| File | Purpose |
|---|---|
| `index.js` | Entry point, loads env vars and starts the scheduler |
| `scheduler.js` | Orchestrates fetch → paraphrase → send → mark-sent, and cron timing |
| `fetcher.js` | Pulls articles from the GNews API |
| `paraphraser.js` | Rewrites article titles via OpenRouter |
| `sentCache.js` | Reads/writes `sent.json` to avoid duplicate posts |
| `sent.json` | Persisted list of already-sent article URLs |
