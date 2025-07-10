"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";

type PersonalitySnapshot = {
  label: string;
  average: number;
};

export default function PersonalityChart() {
  const { currentUser } = useAppContext();
  const personality = currentUser?.personality;

  const hasPersonality =
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number";

  if (!hasPersonality) return null;

  const calculateAverage = (p: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  }) => (p.O + p.C + p.E + p.A + p.N) / 5;

  const chartData: PersonalitySnapshot[] = [];

  // Current personality
  // chartData.push({
  //   label: "Current",
  //   average: parseFloat(calculateAverage(personality).toFixed(2)),
  // });

  // Historical snapshots
personality.history?.forEach((item, index) => {
  const { O, C, E, A, N } = item.scores;
  const isLast = index === personality.history!.length - 1;

  chartData.push({
    label: isLast ? "Current" : `History ${index + 1}`,
    average: parseFloat(calculateAverage({ O, C, E, A, N }).toFixed(2)),
  });
});


 return (
  <Card className="w-full max-w-3xl mx-auto mt-20 bg-white/40 border-none shadow-none">
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-center font-sora text-white">
        Personality Score Trend
      </h2>
      <ResponsiveContainer width="100%" height={260} className="bg-transparent">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          barCategoryGap={24}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-white font-inter"/>
          <YAxis domain={[0, 25]} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            formatter={(value: number) => [`${value.toFixed(2)}`, "Avg"]}
          />
          <Bar dataKey="average" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

}
