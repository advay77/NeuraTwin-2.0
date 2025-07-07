// lib/MemoryContextPrompt.ts
// to send the userid and prompt to backend to get back related journal embeddings.

import api from "./api";

interface MemoryItem {
  type: "prompt" | "journal";
  content: string;
  metadata?: any;
}

interface BuildMemoryContextParams {
  prompt: string;
  userId: string;
}

export async function buildMemoryContext({
  prompt,
  userId,
}: BuildMemoryContextParams): Promise<MemoryItem[]> {
  const memory: MemoryItem[] = [];
  const SCORE_THRESHOLD = 0.2;

  console.log(
    "[buildMemoryContext] Querying Pinecone with prompt:",
    prompt,
    "userId:",
    userId
  );

  // Step 1: Get relevant journals from Pinecone via backend
  const queryResponse = await api.post(
    "/api/pine/query",
    { prompt, userId, topK: 3 },
    { withCredentials: true }
  );
  const journalMatches = queryResponse.data.matches || [];

  const relevantMatches = journalMatches.filter(
    (match: any) => match.score > SCORE_THRESHOLD
  );

  if (relevantMatches.length === 0) {
    console.log(
      "[buildMemoryContext] No relevant matches. Scores:",
      journalMatches.map((m: any) => m.score)
    );
  } else {
    relevantMatches.forEach((match: any) => {
      memory.push({
        type: "journal",
        content: match.metadata?.summary || "",
        metadata: {
          id: match.id,
          score: match.score,
          createdAt: match.metadata?.createdAt,
        },
      });
    });
  }
  // Step 2: Add current user prompt to memory
  memory.push({
    type: "prompt",
    content: prompt,
  });

  return memory;
}
