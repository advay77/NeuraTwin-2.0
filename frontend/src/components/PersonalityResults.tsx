// components/PersonalityInsights.tsx
"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useAppContext } from "@/context/AppContext";
import { Personality, User } from "@/types/User";
import { BiGhost } from "react-icons/bi";
import { getTraitMessage } from "@/lib/personalityUtils";

// Helper to check if personality data is filled
function isPersonalityFilled(personality: Personality): boolean {
  return (
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number"
  );
}

const labelMap: Record<keyof Personality, string> = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extraversion",
  A: "Agreeableness",
  N: "Neuroticism",
  updatedAt: "",
  history: "",
};

const colorMap: Record<keyof Personality, string> = {
  O: "bg-indigo-500",
  C: "bg-indigo-500",
  E: "bg-indigo-500",
  A: "bg-indigo-500",
  N: "bg-indigo-500",
  updatedAt: "",
  history: "",
};

export default function PersonalityInsights() {
  const { currentUser } = useAppContext();
  const router = useRouter();

  if (!currentUser) return null;
  const { personality } = currentUser;

  return (
    <div className="w-full px-2 py-4 bg-white/10 rounded-xl mt-20">
      <h1 className="font-sora text-2xl tracking-tight text-center text-white mb-3">
        Your Personality Insights
      </h1>

      {isPersonalityFilled(personality) ? (
        <div className="mt-10 space-y-6">
          {["O", "C", "E", "A", "N"].map((traitKey) => {
            const key = traitKey as keyof Personality;
            const score = personality[key] as number;

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-sora text-white text-[16px]">
                    {labelMap[key]}
                  </p>
                  <p className="font-sora text-sm text-gray-300">{score}/25</p>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorMap[key]} rounded-full`}
                    style={{ width: `${(score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-base text-gray-300 mt-2 font-inter tracking-tight leading-snug">
                  {getTraitMessage(score, key)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-6 w-full">
          <BiGhost
            size={34}
            className="text-white my-3 flex items-center justify-center w-full"
          />
          <p className="text-gray-200 text-base font-inter mb-4 font-medium ">
            You haven't taken the personality test yet.
          </p>
          <button
            type="button"
            onClick={() => router.push("/personality-test")}
            className="bg-gradient-to-br from-[#7b68ee] to-indigo-600 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-sora transition"
          >
            Take Test
          </button>
        </div>
      )}
    </div>
  );
}
