// components/PersonalityInsights.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Personality, User } from "@/types/User";
import { BiGhost } from "react-icons/bi";
import { getTraitMessage } from "@/lib/personalityUtils";
import { LuCircleFadingPlus } from "react-icons/lu";

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
  C: "bg-blue-500",
  E: "bg-fuchsia-500",
  A: "bg-purple-500",
  N: "bg-yellow-500",
  updatedAt: "",
  history: "",
};

export default function PersonalityInsights() {
  const { currentUser } = useAppContext();
  const router = useRouter();

  if (!currentUser) return null;
  const { personality } = currentUser;

  return (
    <div className="w-full px-3 py-4 bg-gray-800/40 rounded-xl ">
      <h1 className="font-sora text-2xl tracking-tight text-center text-white max-[450px]:mb-4 pt-2">
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
                  <p className="font-sora text-white text-[16px] font-medium">
                    {labelMap[key]}
                  </p>
                  <p className="font-sora text-sm text-gray-200">{score}/25</p>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorMap[key]} rounded-full`}
                    style={{ width: `${(score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-base text-gray-200 mt-2 font-inter tracking-tight leading-snug">
                  {getTraitMessage(score, key)}
                </p>
              </div>
            );
          })}
          <button
            type="button"
            className="w-fit bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-1 rounded-md mx-auto flex items-center justify-center"
          >
            <p className="font-sora text-white text-base font-light flex items-center gap-2">
              View More <LuCircleFadingPlus size={20} className="text-white" />
            </p>
          </button>
        </div>
      ) : (
        <div className="h-auto w-full flex flex-col items-center justify-center">
          <BiGhost
            // size={34}
            className="text-white/40 mb-10 max-[600px]:mb-5 flex items-center justify-center w-full text-5xl min-[600px]:text-[120px]"
          />
          <p className="text-gray-200 text-base min-[800px]:text-lg capitalize font-inter mb-10 font-medium ">
            You haven't taken the personality test yet.
          </p>
          <button
            type="button"
            onClick={() => router.push("/personality-test")}
            className="bg-gradient-to-br from-[#7b68ee] to-indigo-600 hover:bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-xl font-sora transition"
          >
            Take Test
          </button>
        </div>
      )}
    </div>
  );
}
