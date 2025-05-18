const axios = require("axios");

async function paraphraseContent(text) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-prover-v2:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that rewrites content to avoid copyright infringement.",
          },
          {
            role: "user",
            content: `Paraphrase this article to make it unique and original:\n\n${text}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data.choices?.[0]?.message?.content || "❌ Paraphrasing failed."
    );
  } catch (error) {
    console.error(
      "❌ DeepSeek paraphrasing failed:",
      error.response?.data || error.message
    );
    return "❌ Error during paraphrasing.";
  }
}

module.exports = paraphraseContent;
