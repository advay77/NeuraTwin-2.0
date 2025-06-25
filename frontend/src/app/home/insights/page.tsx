"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { getPersonalityRetakeStatus } from "@/lib/CheckPersonalityTest";
import PersonalityInsights from "@/components/PersonalityResults";

const page = () => {
  const { currentUser } = useAppContext();
  const personality = currentUser?.personality;

  if (!personality) return null;

  const { canRetake, daysSinceUpdate, daysLeft } = getPersonalityRetakeStatus(
    personality.updatedAt
  );

  return (
    <section className="text-center text-white font-sora py-8 max-w-[800px] mx-auto px-4">
      <h1 className="text-2xl font-medium mb-10 font-sora">
        Your Insights and Progress
      </h1>

      <PersonalityInsights />

      <div className="mt-10">
        <p className="text-lg">
          Last personality test taken on:{" "}
          <span className="text-indigo-500">
            {new Date(personality.updatedAt).toLocaleDateString()}
          </span>
        </p>

        <div className="mt-4">
          <button
            disabled={!canRetake}
            className={`px-6 py-2 rounded-md transition ${
              canRetake
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {canRetake
              ? "Retake Personality Test"
              : `Retake in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default page;
