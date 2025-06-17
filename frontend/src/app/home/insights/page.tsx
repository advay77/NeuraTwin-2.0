"use client";

import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useAppContext } from "@/context/AppContext";
import { format, parseISO, addDays } from "date-fns";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const { journals, currentUser } = useAppContext();
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!currentUser) return;

    const start = new Date(currentUser.createdAt);
    const end = addDays(start, 89);

    const allDays = Array.from({ length: 90 }, (_, i) => {
      const date = format(addDays(start, i), "yyyy-MM-dd");
      return date;
    });

    const journalDates = journals.map((j) =>
      format(parseISO(j.createdAt), "yyyy-MM-dd")
    );

    const data = allDays.map((date) => ({
      date,
      count: journalDates.includes(date) ? 1 : 0,
    }));

    setStartDate(start);
    setHeatmapData(data);
  }, [journals, currentUser]);

  return (
    <div className="px-6 max-[370px]:px-3 py-4 min-[600px]:p-6 mt-3 max-w-[1000px] mx-auto h-full">
      <motion.h2
        className="text-2xl font-semibold text-white text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Your Journal Activity
      </motion.h2>

      <div className="rounded-lg border border-white/10 p-3 bg-white/10">
        <CalendarHeatmap
          startDate={startDate}
          endDate={addDays(startDate, 89)}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return value.count === 1 ? "color-filled" : "color-empty";
          }}
          showWeekdayLabels={false}
          //   transformDayElement={(rect, value) => {
          //     const fillColor = value?.count === 1 ? "#8b5cf6" : "#9ca3af"; // purple or gray
          //     const style = {
          //       ...rect.props.style,
          //       fill: fillColor,
          //       opacity: value?.count === 1 ? 1 : 0.4,
          //       rx: 3, // rounded corners
          //       ry: 3,
          //     };

          //     return React.cloneElement(rect, { style });
          //   }}
        />
        {/* <CalendarHeatmap
          startDate={startDate}
          endDate={addDays(startDate, 89)}
          values={heatmapData}
          showWeekdayLabels={false}
          classForValue={() => undefined} // disables internal class logic
          transformDayElement={(rect, value) => {
            const fillColor = value?.count === 1 ? "#8b5cf6" : "#9ca3af"; // purple or gray
            const style = {
              ...rect.props.style,
              fill: fillColor,
              opacity: value?.count === 1 ? 1 : 0.4,
              rx: 3, // rounded corners
              ry: 3,
            };

            return React.cloneElement(rect, { style });
          }}
        /> */}

        <div className="flex justify-between text-xs mt-4 text-white font-sora">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-600 rounded-sm" /> Journaled
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-400 rounded-sm" /> Missed
          </span>
        </div>
      </div>
    </div>
  );
}
