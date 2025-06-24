"use client";
import GoalManager from "@/components/GoalManager";
import React from "react";
// import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useAIContext } from "@/context/AiContext";
const page = () => {
  // const { currentUser } = useAppContext();
  const { handleGoalsQuestion } = useAIContext();
  const router = useRouter();
  const aiSuggestions = [
    "What short-term goals should I set to align with my long-term vision?",
    "Are my current goals too ambitious or too easy?",
    "What goals would help me grow in my personal and professional life?",
    "How can I break down my main goal into smaller, actionable steps?",
    "What’s the best way to prioritize my goals right now?",
    "Am I focusing on the right type of goals for my personality and lifestyle?",
  ];
  const getRandomSuggestions = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomSuggestions = getRandomSuggestions(aiSuggestions, 3);

  return (
    <section>
      <GoalManager />
      <div className="mt-10 pb-20 px-4 max-w-[600px] mx-auto">
        <h2 className="text-2xl font-medium text-white mb-4 text-center font-sora">
          AI Suggestions for You
        </h2>
        <div className="space-y-3 min-[600px]:space-y-8">
          {randomSuggestions.map((question, index) => (
            <div
              key={index}
              onClick={() => {
                handleGoalsQuestion(question);
                router.push("/home");
              }}
              className="px-3 py-2 bg-white/10 rounded-lg  text-white hover:bg-indigo-500/20 transition cursor-pointer text-base font-inter min-[600px]:text-lg"
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default page;
