const axios = require("axios");

async function fetchArticles() {
  const gnews = await axios.get(`https://gnews.io/api/v4/search`, {
    params: {
      q: "web3 OR blockchain",
      lang: "en",
      token: process.env.GNEWS_API_KEY,
    },
  });

  return gnews.data.articles.map((article) => ({
    title: article.title,
    content: article.description || article.content,
    url: article.url,
  }));
}

module.exports = fetchArticles;
