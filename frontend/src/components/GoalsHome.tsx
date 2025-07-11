"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RadialBarChart, RadialBar, PolarAngleAxis, PolarGrid } from "recharts";

import { useRouter } from "next/navigation";
const GoalsHome = () => {
  const { goals } = useAppContext(); 
  const router = useRouter();

  const firstGoal = goals[0];
  const otherGoals = goals.slice(1);

  return (
    <section className="w-full px-3 py-4 bg-gray-800/40  rounded-xl mt-14 min-[700px]:mt-24 space-y-6">
      <h1 className="font-sora text-2xl tracking-tight text-center text-white mb-3 pt-2">
        Your Goals
      </h1>

      {/* First Goal - Circle Progress */}
      {firstGoal && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-white font-medium mb-3 text-[18px] font-sora tracking-tight text-center">
            {firstGoal.title}
          </h2>
     
          <div className="mb-2">
            <RadialBarChart
              width={150}
              height={150}
              innerRadius="70%"
              outerRadius="100%"
              data={[
                {
                  name: "Progress",
                  value: firstGoal.progress,
                  fill: "#4ade80",
                },
              ]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarGrid radialLines={false} />
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} />
              <text
                x={80}
                y={80}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="16"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                className="font-inter text-2xl"
              >
                {firstGoal.progress}%
              </text>
            </RadialBarChart>
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
                className="h-full bg-indigo-400"
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
          className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white font-light px-4 py-1 rounded-md transition font-sora"
        >
          Add Goal
        </button>
        <button
          onClick={() => router.push("/home/goals")}
          className="bg-gray-400 hover:bg-indigo-600 cursor-pointer text-white font-light px-4 py-1 rounded-md transition font-sora"
        >
          Edit Goals
        </button>
      </div>
    </section>
  );
};

export default GoalsHome;
