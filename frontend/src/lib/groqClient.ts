import { getTraitMessage } from '@/lib/personalityUtils';
import { Goal, PersonalityScores } from '@/types/User';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export type GroqMode =
  | 'personality_q'
  | 'goal_suggest'
  | 'growth_advice'
  | 'journal_insight'
  | 'general_q'
  | 'routine_q';

interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface GroqAIParams {
  apiKey: string;
  mode: GroqMode;
  question: string;
  name: string;
  occupation: string;
  personality: PersonalityScores;
  goals?: Goal[]; // Only for goal_suggest
  journalSummaries?: string[]; // for journal embeddings
  routines?: RoutineItem[];
  recentContext?: { prompt: string; response: string }[]; // dont need to include createAT
}

export const callGroqAI = async ({
  apiKey,
  mode,
  question,
  name,
  occupation,
  personality,
  goals = [],
  journalSummaries = [],
  routines = [],
  recentContext = [],
}: GroqAIParams) => {
  const insights = {
    O: getTraitMessage(personality.O, 'O'),
    C: getTraitMessage(personality.C, 'C'),
    E: getTraitMessage(personality.E, 'E'),
    A: getTraitMessage(personality.A, 'A'),
    N: getTraitMessage(personality.N, 'N'),
  };

  let systemPrompt = '';

  switch (mode) {
    case 'personality_q':
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

    case 'general_q':
      // Only include active goals
      const activeGoals = goals.filter((g) => g.status === 'active');

      const goalList = activeGoals.map((g) => `- ${g.title}`).join('\n');

      const journalContext =
        journalSummaries.length > 0
          ? journalSummaries.join('\n')
          : 'No related journals found.';

      const recentChatContext =
        recentContext && recentContext.length > 0
          ? recentContext
              .map((chat) => `User: ${chat.prompt}\nAI: ${chat.response}`)
              .join('\n\n')
          : 'No recent chat history available.';

      systemPrompt = `
You are NeuraTwin, an AI mentor who provides helpful responses based on personality, goals, and journal reflections.

User Profile:
- Name: ${name}
- Occupation: ${occupation}
- Personality:
  - Openness: ${personality.O} → ${insights.O}
  - Conscientiousness: ${personality.C} → ${insights.C}
  - Extraversion: ${personality.E} → ${insights.E}
  - Agreeableness: ${personality.A} → ${insights.A}
  - Neuroticism: ${personality.N} → ${insights.N}

Goals:
${goalList}

Past Reflections (Journals):
${journalContext}


Recent Conversations:
${recentChatContext}

Please answer the user's current question below with empathy and clarity. Max 8 lines.
`;
      break;

    case 'routine_q':
      const activeRoutineList = routines.length
        ? routines
            .map((r) => {
              const status = r.completed ? ' Completed' : 'Not Completed';
              return `- ${r.title} (${r.priority} priority) — ${status}${
                r.description ? `\n  Description: ${r.description}` : ''
              }`;
            })
            .join('\n')
        : 'No routines available.';

      const activeGoalList =
        goals.length > 0
          ? goals
              .filter((g) => g.status === 'active')
              .map((g) => `- ${g.title}`)
              .join('\n')
          : 'No active goals.';

      systemPrompt = `
You are NeuraTwin, an AI mentor that helps users optimize their daily routines for maximum personal growth, based on their goals and personality traits.

User Profile:
- Name: ${name}
- Occupation: ${occupation}
- Personality:
  - Openness: ${personality.O} → ${insights.O}
  - Conscientiousness: ${personality.C} → ${insights.C}
  - Extraversion: ${personality.E} → ${insights.E}
  - Agreeableness: ${personality.A} → ${insights.A}
  - Neuroticism: ${personality.N} → ${insights.N}

Goals:
${activeGoalList}

Current Daily Routine:
${activeRoutineList}

Please analyze the routine and respond clearly to the following question:
"${question}"

Keep your response warm, motivating, and under 8 lines.
`;
      break;

    case 'goal_suggest':
      const activeRoutineList2 = routines.length
        ? routines
            .map((r) => {
              const status = r.completed ? ' Completed' : 'Not Completed';
              return `- ${r.title} (${r.priority} priority) — ${status}${
                r.description ? `\n  Description: ${r.description}` : ''
              }`;
            })
            .join('\n')
        : 'No routines available.';

      const activeGoalList2 =
        goals.length > 0
          ? goals
              .filter((g) => g.status === 'active')
              .map((g) => `- ${g.title} (${g.progress}%)`)
              .join('\n')
          : 'No active goals.';

      systemPrompt = `
You are NeuraTwin, an AI that helps users to reach to their goals, improve their daily routines and overall well-being.

User:
- Name: ${name}
- Occupation: ${occupation}
- Current Goals with progress:
${activeGoalList2}
Current Daily Routine:
${activeRoutineList2}
Personality:
- Openness: ${personality.O} → ${insights.O}
- Conscientiousness: ${personality.C} → ${insights.C}
- Extraversion: ${personality.E} → ${insights.E}
- Agreeableness: ${personality.A} → ${insights.A}
- Neuroticism: ${personality.N} → ${insights.N}

Please analyze the user personality, routine and goals and respond clearly to the following question in short concise way:
"${question}"
`;
      break;

    case 'growth_advice':
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

    case 'journal_insight':
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
      throw new Error('Invalid Groq mode');
  }

  const body = {
    model: GROQ_MODEL,
    temperature: 0.7,
    max_tokens: 250,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
  };

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Groq API Error');

    return data.choices?.[0]?.message?.content || 'No response received.';
  } catch (err: any) {
    console.error('Groq call failed:', err.message);
    return '⚠️ AI failed to respond. Try again later.';
  }
};
