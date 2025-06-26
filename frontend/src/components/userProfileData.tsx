import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const personality = currentUser?.personality;
  const hasPersonality =
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number";

  const completedMilestones = (currentUser?.goals || []).filter(
    (goal) => goal.status === "completed"
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      {/* Avatar and Basic Info */}
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/images/default-avatar.png" // 📌 replace with your preset
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full border-4 border-indigo-500"
        />
        <h2 className="text-2xl font-bold mt-4">{currentUser.name}</h2>
        <p className="text-gray-600">{currentUser.email}</p>
      </div>

      {/* Bio Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <strong>DOB:</strong> {currentUser.dob?.slice(0, 10)}
        </div>
        <div>
          <strong>Gender:</strong> {currentUser.gender}
        </div>
        <div>
          <strong>Occupation:</strong> {currentUser.occupation}
        </div>
      </div>

      {/* Personality */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Personality Scores (OCEAN)
        </h3>
        {hasPersonality ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Openness:</strong> {personality?.O}
            </div>
            <div>
              <strong>Conscientiousness:</strong> {personality?.C}
            </div>
            <div>
              <strong>Extraversion:</strong> {personality?.E}
            </div>
            <div>
              <strong>Agreeableness:</strong> {personality?.A}
            </div>
            <div>
              <strong>Neuroticism:</strong> {personality?.N}
            </div>
          </div>
        ) : (
          <button
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => router.push("/personality-test")}
          >
            Take Test Now
          </button>
        )}
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Milestones</h3>
        {completedMilestones.length > 0 ? (
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {completedMilestones.map((goal, idx) => (
              <li key={idx}>
                {goal.title} (Completed on {goal.endDate?.slice(0, 10) || "N/A"}
                )
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No milestones yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
