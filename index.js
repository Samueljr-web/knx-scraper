require("dotenv").config();
const { startScheduler } = require("./scheduler");

console.log("🤖 Bot started...");
startScheduler();
