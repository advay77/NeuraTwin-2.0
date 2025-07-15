import { useEffect, useState } from "react";
import { useSpeech } from "@/lib/useSpeech";
import { useAppContext } from "@/context/AppContext";

// Helper to check if a date is today
const isToday = (dateStr: string) => {
  const today = new Date();
  const createdAt = new Date(dateStr);
  return (
    createdAt.getFullYear() === today.getFullYear() &&
    createdAt.getMonth() === today.getMonth() &&
    createdAt.getDate() === today.getDate()
  );
};

export const useOrbCompanion = () => {
  const { isSpeaking } = useSpeech();
  const { currentUser, journals, fetchJournals, goals, speak, routines } =
    useAppContext();

  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Fetch journals once on mount
  useEffect(() => {
    fetchJournals();
  }, []);

  // Update state when journals change
  useEffect(() => {
    const hasTodayEntry = journals.some((j) => isToday(j.createdAt));
    setHasSubmittedToday(hasTodayEntry);
  }, [journals]);

  useEffect(() => {
    if (!currentUser || isSpeaking) return;

    const speakRandom = () => {
      const lines: string[] = [];

      // 🔹 Random greeting
      if (Math.random() < 0.3) {
        lines.push(
          `Hey ${currentUser.name}, just checking in! I'm always here for you. How's your day going?`
        );
      }

      // 🔹 Journal reminder
      if (!hasSubmittedToday && Math.random() < 0.5) {
        lines.push(
          `Don't forget to reflect today. Have you written your journal yet?`
        );
      }

      // 🔹 Goal motivation with progress
      const activeGoals = goals.filter((g) => g.status === "active");
      if (activeGoals.length > 0) {
        const activeGoal =
          activeGoals[Math.floor(Math.random() * activeGoals.length)];

        if (Math.random() < 0.6) {
          const remaining = 100 - (activeGoal.progress || 0);
          const message =
            remaining > 10
              ? `Keep going on your goal: ${activeGoal.title}. You're just ${remaining}% away from achieving it!`
              : `You're almost there! Just ${remaining}% left to complete your goal: ${activeGoal.title}. Let's finish strong!`;

          lines.push(message);
        }
      }

      // 🔹 Routine reminder
      if (routines.length > 0 && Math.random() < 0.5) {
        lines.push(
          `Don't forget to complete your routines today. Every small habit brings you closer to your better self.`
        );
      }

      if (lines.length > 0) {
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        speak(randomLine, {
          rate: 1,
          pitch: 1.1,
          lang: "en-US",
          voiceName: "Microsoft Hazel - English (United Kingdom)",
        });
      }
    };

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNextSpeak = () => {
      const allowedDelays = [20_000, 45_000, 60_000, 120_000, 180_000]; // in milliseconds
      const delayMs =
        allowedDelays[Math.floor(Math.random() * allowedDelays.length)];

      console.log(`🗣️ Next speak in ${delayMs / 1000} seconds`);

      //   const delaySeconds = Math.floor(Math.random() * 25) + 5; // 5–30 seconds
      //   const delayMs = delaySeconds * 1000;
      //   console.log(`🧪 Next speak in ${delaySeconds} seconds`);

      timeout = setTimeout(() => {
        speakRandom();
        scheduleNextSpeak(); // Schedule again
      }, delayMs);
    };

    scheduleNextSpeak();

    return () => clearTimeout(timeout);
  }, [currentUser, journals, goals, hasSubmittedToday, isSpeaking]);
};
