export const checkVaguePrompt = (prompt: string): boolean => {
  const vaguePhrases = [
    "continue",
    "go on",
    "what do you mean",
    "explain more",
    "and then?",
    "tell me more",
    "what next?",
    "elaborate",
    "more info",
    "why?",
    "what else?",
  ];

  const lower = prompt.trim().toLowerCase();
  return vaguePhrases.some((phrase) => lower.includes(phrase));
};
