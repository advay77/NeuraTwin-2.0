import { getTraitMessage } from "@/lib/personalityUtils";
import { Goal, PersonalityScores } from "@/types/User";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"; 

export type GroqMode = "personality_q" | "goal_suggest" | "growth_advice" | "journal_insight"| "general_q";



interface GroqAIParams {
  apiKey: string;
  mode: GroqMode;
  question: string;
  name: string;
  occupation: string;
  personality: PersonalityScores;
  goals?: Goal[]; // Only for goal_suggest
}

export const callGroqAI = async ({
  apiKey,
  mode,
  question,
  name,
  occupation,
  personality,
  goals = [],
}: GroqAIParams) => {
  const insights = {
    O: getTraitMessage(personality.O, "O"),
    C: getTraitMessage(personality.C, "C"),
    E: getTraitMessage(personality.E, "E"),
    A: getTraitMessage(personality.A, "A"),
    N: getTraitMessage(personality.N, "N"),
  };

  let systemPrompt = "";

  switch (mode) {
    case "personality_q":
      systemPrompt = `
You are NeuraTwin, an AI mentor who understands people through psychology and empathy.

User Details:
- Name: ${name}
- Occupation: ${occupation}
- Personality Traits:
  - Openness: ${personality.O} → ${insights.O}
  - Conscientiousness: ${personality.C} → ${insights.C}
  - Extraversion: ${personality.E} → ${insights.E}
  - Agreeableness: ${personality.A} → ${insights.A}
  - Neuroticism: ${personality.N} → ${insights.N}

Based on this, answer the user’s question below in a kind, encouraging and motivating way, and keep it short and to the point. maximum 7-8 lines.
`;
      break;

    case "goal_suggest":
      const goalTitles = goals.map((g) => `- ${g.title}`).join("\n") || "None yet";
      systemPrompt = `
You are NeuraTwin, an AI that helps users choose goals that match their personality.

User:
- Name: ${name}
- Occupation: ${occupation}
- Current Goals:
${goalTitles}

Personality:
- Openness: ${personality.O} → ${insights.O}
- Conscientiousness: ${personality.C} → ${insights.C}
- Extraversion: ${personality.E} → ${insights.E}
- Agreeableness: ${personality.A} → ${insights.A}
- Neuroticism: ${personality.N} → ${insights.N}

Suggest 3 new goals that could be meaningful for this person.
Make them realistic and thoughtful.
`;
      break;

    case "growth_advice":
      systemPrompt = `
You are NeuraTwin, an AI focused on helping people grow mentally, emotionally, and personally.

User Info:
- Name: ${name}
- Occupation: ${occupation}
- Personality Traits:
  - Openness: ${personality.O} → ${insights.O}
  - Conscientiousness: ${personality.C} → ${insights.C}
  - Extraversion: ${personality.E} → ${insights.E}
  - Agreeableness: ${personality.A} → ${insights.A}
  - Neuroticism: ${personality.N} → ${insights.N}

Give personal advice that encourages growth, reflection, and confidence.
Respond like a calm coach or friend.
`;
      break;

      case "journal_insight":
  systemPrompt = `
You are a journal analysis assistant AI.

Please analyze the following journal entry and return only the following in JSON:
- "mood": The user's overall mood (1 word, e.g., happy, anxious)
- "tone": The emotional tone (1 word, e.g., hopeful, frustrated)
- "summary": A short summary (2-3 lines) of the journal

Respond ONLY in this format:
{
  "mood": "...",
  "tone": "...",
  "summary": "..."
}

Journal:
"${question}"
  `;
  break;



    default:
      throw new Error("Invalid Groq mode");
  }

  const body = {
    model: GROQ_MODEL,
    temperature: 0.7,
    max_tokens: 150,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
  };

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Groq API Error");

    return data.choices?.[0]?.message?.content || "No response received.";
  } catch (err: any) {
    console.error("Groq call failed:", err.message);
    return "⚠️ AI failed to respond. Try again later.";
  }
};
