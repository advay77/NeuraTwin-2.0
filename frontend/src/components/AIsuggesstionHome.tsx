"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { PersonalityScores } from "@/types/User";
import { useAIContext } from "@/context/AiContext";
interface Suggestion {
  trait: keyof PersonalityScores;
  question: string;
}

const isPersonalityFilled = (personality: PersonalityScores): boolean => {
  return (
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number"
  );
};

const getSuggestion = (
  trait: keyof PersonalityScores,
  score: number
): Suggestion => {
  if (score <= 5) {
    switch (trait) {
      case "O":
        return {
          trait,
          question: "Why do I feel anxious when something unfamiliar comes up?",
        };
      case "C":
        return {
          trait,
          question: "Why do I struggle to stay consistent with my plans?",
        };
      case "E":
        return {
          trait,
          question:
            "Why do I shut down around groups, even if I want to connect?",
        };
      case "A":
        return {
          trait,
          question:
            "Is it okay that I value honesty more than pleasing others?",
        };
      case "N":
        return {
          trait,
          question: "How do I stop small things from affecting me so deeply?",
        };
    }
  } else if (score <= 10) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How can I ease into new ideas without overwhelming myself?",
        };
      case "C":
        return {
          trait,
          question: "How do I build habits that actually stick for me?",
        };
      case "E":
        return {
          trait,
          question:
            "Why do I hesitate to speak up even when I have something to say?",
        };
      case "A":
        return {
          trait,
          question: "How can I be more open without feeling too vulnerable?",
        };
      case "N":
        return {
          trait,
          question: "What are some quick ways I can calm myself when stressed?",
        };
    }
  } else if (score <= 15) {
    switch (trait) {
      case "O":
        return {
          trait,
          question: "How do I balance being imaginative with staying grounded?",
        };
      case "C":
        return {
          trait,
          question: "How can I stay organized without feeling restricted?",
        };
      case "E":
        return {
          trait,
          question: "How do I stay socially engaged without burning out?",
        };
      case "A":
        return {
          trait,
          question: "How do I protect my energy and still support others?",
        };
      case "N":
        return {
          trait,
          question:
            "How do I process emotions without letting them control me?",
        };
    }
  } else if (score <= 20) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How can I turn my ideas into something that truly matters?",
        };
      case "C":
        return {
          trait,
          question: "How do I stay driven without exhausting myself?",
        };
      case "E":
        return {
          trait,
          question: "How do I use my energy to build real, deep connections?",
        };
      case "A":
        return {
          trait,
          question: "How do I remain kind without being taken advantage of?",
        };
      case "N":
        return {
          trait,
          question:
            "How do I stay emotionally steady when things don’t go my way?",
        };
    }
  } else {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How do I channel my creativity into something lasting and impactful?",
        };
      case "C":
        return {
          trait,
          question:
            "How can I guide others using the structure I've built for myself?",
        };
      case "E":
        return {
          trait,
          question:
            "How do I inspire others through my presence and confidence?",
        };
      case "A":
        return {
          trait,
          question:
            "How do I help people grow without losing my own boundaries?",
        };
      case "N":
        return {
          trait,
          question:
            "How do I use my emotional sensitivity as a source of strength?",
        };
    }
  }

  return {
    trait,
    question: "What can I do to grow personally and emotionally?",
  };
};

interface AIsuggestionHomeProps {
  onSuggestionClick: () => void;
}

const AIsuggestionHome: React.FC<AIsuggestionHomeProps> = ({
  onSuggestionClick,
}) => {
  const { currentUser } = useAppContext();
  const personality = currentUser?.personality;
  const { handleAskAI } = useAIContext();

  if (!personality || !isPersonalityFilled(personality)) {
    return (
      <div className="w-full px-3 py-4 my-14 min-[700px]:my-20 bg-gray-800/20 rounded-xl">
        <h2 className="text-[24px] font-medium text-white text-left font-sora mb-3 tracking-tight">
          🤖 AI Suggestions For You
        </h2>
        <p className="text-white/80 text-base font-inter text-center text-balance">
          Take the{" "}
          <span className="font-light text-white">personality test</span> to
          unlock custom AI suggestions tailored to your traits.
        </p>
      </div>
    );
  }

  const suggestions: Suggestion[] = (
    ["O", "C", "E", "A", "N"] as (keyof PersonalityScores)[]
  ).map((trait) => getSuggestion(trait, personality[trait]));

  return (
    <div className="w-full px-3 py-4 my-14">
      <h2 className="text-[24px] font-medium text-white text-left font-sora mb-5 tracking-tight">
        🤖 AI Suggestions For You
      </h2>
      <div className="flex flex-col gap-4">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            className="bg-gray-800/30 hover:bg-white/20 text-white text-base font-medium px-4 py-3 rounded-lg text-left transition duration-200 font-inter tracking-tight leading-snug"
            onClick={() => {
              // console.log("User clicked:", s.question);
              handleAskAI(s.question);
              onSuggestionClick();
            }}
          >
            {s.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIsuggestionHome;
