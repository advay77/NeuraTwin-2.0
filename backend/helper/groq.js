// utils/groq.js
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

exports.getJournalInsights = async (text) => {
  const fetch = (await import("node-fetch")).default;

  const systemPrompt = `
You are a journaling AI assistant.

Analyze the following journal entry and return:
- mood (1 word)
- tone (1 word)
- a 2-3 line summary

Respond strictly in JSON format:
{
  "mood": "...",
  "tone": "...",
  "summary": "..."
}
Do NOT include markdown formatting or code blocks.

Journal:
"${text}"
`;

  const body = {
    model: GROQ_MODEL,
    temperature: 0.7,
    max_tokens: 200,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
  };

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    // console.log("[GROQ Raw Response]:", content);

    // Clean markdown wrapping if any
    const cleaned = content
      .replace(/```json\n?/i, "")
      .replace(/```$/, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("GROQ Error:", err.message);
    return { mood: "", tone: "", summary: "" };
  }
};
