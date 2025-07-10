"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar } from "lucide-react";

interface PersonalityScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

interface Goal {
  title: string;
  status: string;
  endDate?: string;
}

interface User {
  name: string;
  email: string;
  dob: string;
  gender: string;
  occupation: string;
  personality?: PersonalityScores & { updatedAt?: string };
  goals?: Goal[];
}

const UserProfile = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();
  const { goals } = useAppContext();
  const personality = currentUser?.personality;
  const hasPersonality =
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number";


  const completedMilestones = (goals || []).filter(
    (goal) => goal.status === "completed"
  );

  const personalityTraits = [
    { label: "Openness", key: "O", value: personality?.O || 0 },
    { label: "Conscientiousness", key: "C", value: personality?.C || 0 },
    { label: "Extraversion", key: "E", value: personality?.E || 0 },
    { label: "Agreeableness", key: "A", value: personality?.A || 0 },
    { label: "Neuroticism", key: "N", value: personality?.N || 0 },
  ];

  return (
    <section className="max-w-[1000px] mx-auto py-8 px-4">
      {/* AVATAR AND BASIC INFO  */}
      <div className="flex max-[600px]:flex-col flex-row items-center justify-center gap-8 bg-white/30 py-4 rounded-xl">
        <div className="">
          <Image
            src={
              currentUser?.gender?.toLowerCase() === "male"
                ? "/boy1.jpg"
                : "/girl1.jpg"
            }
            alt="Avatar"
            width={0}
            height={0}
            sizes="(min-width: 1000px) 100px, (min-width: 500px) 70px, 45px"
            className="rounded-full w-[160px] h-auto cursor-pointer"
          />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-sora text-white font-semibold capitalize">
            {currentUser.name}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/30 rounded-full">
            <span className="text-indigo-200 text-sm">💼</span>
            <p className="text-indigo-100 font-medium font-inter text-base capitalize">
              {currentUser.occupation}
            </p>
          </div>
          <p className="text-white/90 italic text-base">{currentUser.email}</p>
          <div className="flex items-center justify-center gap-8 text-center font-sora text-sm text-white/80 mt-4 bg-white/10 rounded-lg py-2 px-4 inline-flex">
            <div className="flex items-center gap-1">
              <span>🎂</span>
              <span>DOB: {currentUser.dob?.slice(0, 10)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>
                {currentUser.gender?.toLowerCase() === "male" ? "👨" : "👩"}
              </span>
              <span>Gender: {currentUser.gender}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center min-[600px]:flex-row flex-col mt-8 gap-10">
        {/* Personality Scores Section */}
        <div className="flex-1 max-w-md mx-auto">
          <h3 className="text-2xl font-sora text-white text-center my-2">
            Personality Scores (OCEAN)
          </h3>
          {hasPersonality ? (
            <Card className="bg-white/20 border-white/30">
              <CardContent className="p-6 space-y-4">
                {personalityTraits.map((trait) => (
                  <div key={trait.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium font-inter">
                        {trait.label}
                      </span>
                      <span className="text-white font-bold">
                        {trait.value}/100
                      </span>
                    </div>
                    <Progress
                      value={trait.value}
                      className="h-3 bg-white/20 "
                      style={
                        {
                          "--progress-background": "rgb(99 102 241)",
                          "--progress-foreground": "rgb(87 93 245)",
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
                <div className="mt-4 text-center">
                  <p className="text-gray-300 text-sm">
                    Last updated:{" "}
                    {personality?.updatedAt
                      ? new Date(personality.updatedAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center">
              <button
                className="mt-3 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                onClick={() => router.push("/personality-test")}
              >
                Take Test Now
              </button>
            </div>
          )}
        </div>

        {/* Milestones Section */}
        <div className="flex-1 max-w-md mx-auto">
          <h3 className="text-2xl font-sora text-white text-center my-2">
            Milestones
          </h3>
          {completedMilestones.length > 0 ? (
            <Card className="bg-white/20 border-white/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {completedMilestones.map((goal, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 bg-white rounded-lg border border-white/20 "
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-black font-medium font-inter">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-500 text-sm">
                              Completed on {goal.endDate?.slice(0, 10) || "N/A"}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-500/20 text-black border-green-400/30"
                        >
                          ✓ Done
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-300 text-sm">
                    {completedMilestones.length} milestone
                    {completedMilestones.length !== 1 ? "s" : ""} completed
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.min(completedMilestones.length, 5) ? "text-yellow-400" : "text-gray-600"}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-300 text-xs">
                      Achievement Level
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/20 border-white/30">
              <CardContent className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <CheckCircle className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-300 font-medium">No milestones yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Complete your first goal to see it here!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
