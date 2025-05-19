const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "sent.json");

function loadSent() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

function saveSent(sent) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(sent, null, 2));
}

function hasBeenSent(url) {
  const sent = loadSent();
  return sent.includes(url);
}

function markAsSent(url) {
  const sent = loadSent();
  if (!sent.includes(url)) {
    sent.push(url);
    saveSent(sent);
  }
}

module.exports = { hasBeenSent, markAsSent };
