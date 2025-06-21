"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { callGroqAI } from "@/lib/groqClient";
import { PersonalityScores } from "@/types/User";
import { useAppContext } from "./AppContext";
import { useSpeech } from "@/lib/useSpeech";
import { checkPromptAndPersonality } from "@/lib/handlePrompt";
import toast from "react-hot-toast";
import { buildMemoryContext } from "@/lib/MemoryContextPrompt";
interface AIResponse {
  question: string;
  answer: string;
}

interface AIContextType {
  aiResponse: AIResponse | null;
  isAILoading: boolean;
  handleAskAI: (question: string) => Promise<void>;
  aiorbSpeak: boolean;
  setaiOrbSpeak: (value: boolean) => void;
  showResponse: boolean;
  typedText: string;
  setTypedText: React.Dispatch<React.SetStateAction<string>>;
  setShowResponse: React.Dispatch<React.SetStateAction<boolean>>;

  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitPrompt: () => void;
}

const AIContext = createContext<AIContextType | null>(null);

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  const { speak, isSpeaking } = useSpeech();

  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiorbSpeak, setaiOrbSpeak] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const [prompt, setPrompt] = useState<string>(""); //user prompts via input field

  const handleAskAI = async (question: string) => {
    if (!currentUser || !currentUser.personality) return;

    setIsAILoading(true);
    setShowResponse(false); // hide old response & UI while loading

    const response = await callGroqAI({
      apiKey: process.env.NEXT_PUBLIC_GROQ_KEY!,
      mode: "personality_q",
      question,
      name: currentUser.name,
      occupation: currentUser.occupation,
      personality: currentUser.personality,
    });

    // console.log("🧠 AI Response:", response);

    speak(response, {
      rate: 1,
      pitch: 1.1,
      lang: "en-US",
      voiceName: "Microsoft Hazel - English (United Kingdom)",
    });

    setAIResponse({ question, answer: response });
    setTypedText(""); // reset typewriter text
    setShowResponse(true); // trigger UI to show typewriter
    setIsAILoading(false);
  };

  // USER PROMPTS ----------------------------
  const handleSubmitPrompt = async () => {
    if (!currentUser) return;

    const isValid = checkPromptAndPersonality({
      prompt,
      personality: currentUser.personality,
    });

    if (!isValid) {
      speak(
        `${currentUser.name}. Please complete your personality test first. As it will help me to know about you better.`,
        {
          rate: 1,
          pitch: 1.1,
          lang: "en-US",
          voiceName: "Microsoft Hazel - English (United Kingdom)",
        }
      );
      return;
    }
    // CALLLING GROK CLIENT FROM HERE AND PASSING MEMORY CONTEXT!!
    console.log(
      "[handleSubmitPrompt] Submitting prompt:",
      prompt,
      "for user:",
      currentUser._id
    );
    try {
      const memory = await buildMemoryContext({
        prompt,
        userId: currentUser._id,
      });
      console.log(
        "[AI CONTEXT, handleSubmitPrompt()] Memory context built:",
        JSON.stringify(memory, null, 2)
      );

      const journalSummaries = memory
        .filter((item) => item.type === "journal")
        .map((j) => j.content);

      const aiReply = await callGroqAI({
        apiKey: process.env.NEXT_PUBLIC_GROQ_KEY!,
        mode: "general_q",
        question: prompt, // real user prompt
        name: currentUser.name,
        occupation: currentUser.occupation || "User",
        personality: currentUser.personality,
        goals: currentUser.goals || [],
        journalSummaries,
      });

      console.log("[AI CONTEXT, handleSubmitPrompt()] AI reply:", aiReply);

      // const journalstrings = JSON.stringify(journalSummaries, null, 2);
      // console.log(
      //   "[AI CONTEXT , handleSubmitPrompt()] Journal summaries:",
      //   journalstrings
      // );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Track speaking state to control Orb
  useEffect(() => {
    setaiOrbSpeak(isSpeaking);
  }, [isSpeaking]);

  return (
    <AIContext.Provider
      value={{
        aiResponse,
        isAILoading,
        handleAskAI,
        aiorbSpeak,
        setaiOrbSpeak,
        showResponse,
        typedText,
        setTypedText,
        setShowResponse,
        prompt,
        setPrompt,
        handleSubmitPrompt,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAIContext must be used inside AIProvider");
  return ctx;
};
