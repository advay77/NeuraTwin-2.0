// lib/handlePrompt.ts
import { toast } from "react-hot-toast";
import { PersonalityScores } from "@/types/User"; 

export const checkPromptAndPersonality = ({
  prompt,
  personality,
}: {
  prompt: string;
  personality: PersonalityScores;
}) => {
  const trimmed = prompt.trim();

  if (!trimmed) return false;

  const hasPersonality =
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number";

  if (!hasPersonality) {
    toast.error("Complete personality test first.");
    return false;
  }

  return true;
};
