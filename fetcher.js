let currentPage = 1; // Save this across runs, maybe in a file or DB

async function fetchGNews(page = 1) {
  const res = await axios.get(`https://gnews.io/api/v4/search`, {
    params: {
      q: "(web3 OR blockchain OR decentralized OR crypto OR defi OR nft OR metaverse OR tech)",
      lang: "en",
      token: process.env.GNEWS_API_KEY,
      max: 5,
      page,
    },
  });

  return res.data.articles.map((article) => ({
    title: article.title,
    content: article.description || article.content || "",
    url: article.url,
    publishedAt: article.publishedAt,
    source: article.source?.name || "GNews",
  }));
}
