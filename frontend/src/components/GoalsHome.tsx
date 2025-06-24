"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
// import { Goal } from "@/types/User";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
const GoalsHome = () => {
  const { goals } = useAppContext(); //Using global goals now
  const router = useRouter();

  const firstGoal = goals[0];
  const otherGoals = goals.slice(1);

  return (
    <section className="w-full px-3 py-4 bg-white/20 rounded-xl mt-14 min-[700px]:mt-24 space-y-6">
      <h1 className="font-sora text-2xl tracking-tight text-center text-white mb-3 pt-2">
        Your Goals
      </h1>

      {/* First Goal - Circle Progress */}
      {firstGoal && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-white font-medium mb-3 text-[18px] font-sora tracking-tight text-center">
            {firstGoal.title}
          </h2>
          <div className="w-28 h-28 mb-2">
            <CircularProgressbar
              value={firstGoal.progress}
              text={`${firstGoal.progress}%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#4ade80",
                trailColor: "#334155",
              })}
            />
          </div>
          <div className="w-full flex justify-between text-sm min-[700px]:text-base text-gray-200 mt-2 px-2 min-[700px]:px-8 font-inter">
            <span>
              Start: {new Date(firstGoal.startDate).toLocaleDateString()}
            </span>
            <span>
              Deadline: {new Date(firstGoal.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Other Goals - Progress Bars */}
      {otherGoals.length > 0 &&
        otherGoals.map((goal, index) => (
          <div key={index} className="px-3">
            <h2 className="text-white font-medium text-base mb-2 font-sora capitalize">
              {goal.title}
            </h2>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>
                Start: {new Date(goal.startDate).toLocaleDateString()}
              </span>
              <span>
                Deadline: {new Date(goal.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

      {/* Action Buttons */}
      <div className="flex gap-8 justify-center pt-4">
        <button
          onClick={() => router.push("/home/goals")}
          className="bg-indigo-500 hover:bg-green-600 text-white font-light px-4 py-1 rounded-md transition font-sora"
        >
          Add Goal
        </button>
        <button
          onClick={() => router.push("/home/goals")}
          className="bg-purple-500 hover:bg-blue-600 text-white font-light px-4 py-1 rounded-md transition font-sora"
        >
          Edit Goals
        </button>
      </div>
    </section>
  );
};

export default GoalsHome;
