"use client";
import RoutineTracker from "@/components/RoutineTrack";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useAIContext } from "@/context/AiContext";
const page = () => {
  const { routines, currentUser } = useAppContext();
  const { handleAskRoutine } = useAIContext();
  const router = useRouter();

  const aiSuggestions = [
    "What can I improve in my today's routine to get the most out of it?",
    "In order to reach my goals faster, is my routine effective?",
    "Does this routine help me improve my personality and overall well-being?",
  ];

  return (
    <section>
      <RoutineTracker />
      {/* AI SUGGESSTION FOR U */}
      {/* AI Suggestions Section */}
      <div className="mt-10 pb-20 px-4 max-w-[600px] mx-auto">
        <h2 className="text-2xl font-medium text-white mb-4 text-center font-sora">
          AI Suggestions for You
        </h2>

        {routines && routines.length > 0 ? (
          <div className="space-y-3 min-[600px]:space-y-8">
            {aiSuggestions.map((question, index) => (
              <div
                key={index}
                onClick={() => {
                  handleAskRoutine(question);
                  router.push("/home");
                }}
                className="px-3 py-2 bg-white/10 rounded-lg  text-white hover:bg-indigo-500/20 transition cursor-pointer text-base font-inter min-[600px]:text-lg"
              >
                {question}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-base text-center font-inter">
            Create routines to unlock personalized AI suggestions tailored just
            for you.
          </p>
        )}
      </div>
    </section>
  );
};

export default page;
