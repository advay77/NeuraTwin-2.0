// types/user.ts
export interface Goal {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "paused";
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  title: string;
  achievedAt: string;
  relatedGoalId?: string;
}

export interface PersonalityScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface PersonalityHistory {
  date: string;
  scores: PersonalityScores;
}

export interface Personality {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
  updatedAt: string;
  history: PersonalityHistory[];
}

export type League =
  | "Seedling"
  | "Momentum"
  | "Catalyst"
  | "Ascendant"
  | "Summit"
  | "Transcendent";

export interface Growth {
  journalStreak: number;
  milestoneCount: number;
  personalityGrowth: number;
  league: League;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  dob: string;
  gender: string;
  occupation: string;
  avatar?: string;
  goals: Goal[];
  milestones: Milestone[];
  personality: Personality;
  growth: Growth;
  createdAt: string;
  updatedAt: string;
}
