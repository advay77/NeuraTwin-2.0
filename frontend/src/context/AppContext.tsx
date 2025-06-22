"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/User";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useSpeech } from "@/lib/useSpeech";
import { Journal } from "@/types/JournalSchema";

interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}
interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;
  refetchUser: () => void;
  orbSpeak: boolean;
  setOrbSpeak: (value: boolean) => void;
  speak: (text: string, options?: any) => void;
  cancelSpeech: () => void;

  journals: Journal[];
  fetchJournals: (page?: number) => Promise<void>;
  hasMoreJournals: boolean;
  addJournal: (journal: Journal) => void; // just to show instant journal

  routines: RoutineItem[];
  setRoutines: React.Dispatch<React.SetStateAction<RoutineItem[]>>;
}

const AppContext = createContext<AppContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  loading: false,
  refetchUser: () => {},
  orbSpeak: false,
  setOrbSpeak: () => {},

  speak: () => {},
  cancelSpeech: () => {},
  journals: [],
  fetchJournals: async () => {},
  hasMoreJournals: true,
  addJournal: () => {},

  routines: [],
  setRoutines: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orbSpeak, setOrbSpeak] = useState<boolean>(false);
  const { speak, cancelSpeech, isSpeaking } = useSpeech();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [hasMoreJournals, setHasMoreJournals] = useState(true);

  // ROUTINE STATES---
  const [routines, setRoutines] = useState<RoutineItem[]>([]); // stores all routine object

  // ADDING JOURNAL INSTANT----
  const addJournal = (journal: Journal) => {
    setJournals((prev) => [journal, ...prev]);
  };

  // Fetch user data function
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/me");
      if (res.data.success) {
        setCurrentUser(res.data.user);
      } else {
        toast.error("Failed to load user");
        setCurrentUser(null);
      }
    } catch (err: any) {
      // toast.error('User not logged in or token invalid');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when the app mounts or currentUser changes to null
  useEffect(() => {
    if (!currentUser) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Sync orbSpeak with isSpeaking-----------------
  useEffect(() => {
    setOrbSpeak(isSpeaking);
  }, [isSpeaking]);

  // FETCH JOURNALS------------------------------------------------
  const fetchJournals = async (page: number = 1) => {
    try {
      const res = await api.get(`/api/journal/history?page=${page}`);
      const newJournals: Journal[] = res.data.journals;

      setJournals((prev) => {
        const existingIds = new Set(prev.map((j) => j._id));
        const filteredNew = newJournals.filter((j) => !existingIds.has(j._id));
        return [...prev, ...filteredNew];
      });

      setHasMoreJournals(res.data.hasMore);
      console.log(
        `[Client] New journals set. Total count: ${newJournals.length}`
      );
    } catch (err) {
      console.error("Error fetching journals:", err);
    }
  };

  // Fetch page 1 journals on mount--------------------------
  useEffect(() => {
    fetchJournals(1);
  }, []);

  // FETCH ROUTINES------------------------------------------------
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await api.get("/api/routine/get-routine");
        const normalized = res.data.routines.map((routine: any) => ({
          ...routine,
          id: routine._id, // map _id to id
        }));
        setRoutines(normalized);
      } catch (err: any) {
        toast.error("Failed to load routines");
      }
    };

    if (currentUser) fetchRoutines();
  }, [currentUser]);

  // RESET ROUTINES AT MIDNIGHT------------------------------------
  useEffect(() => {
    const now = new Date();
    // Calculate the time difference between now and midnight
    // so that we can reset the routines at midnight
    const millisTillMidnight =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      ).getTime() - now.getTime();

    const timeout = setTimeout(async () => {
      try {
        await api.patch("/api/routine/reset-daily");
        setRoutines((prev) => prev.map((r) => ({ ...r, completed: false })));
        toast.success("New day! Routines reset ✅");
      } catch (err) {
        toast.error("Failed to reset routines");
      }
    }, millisTillMidnight);

    return () => clearTimeout(timeout);
  }, []);

  // ---------------------------------------
  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        refetchUser: fetchUser,
        orbSpeak,
        setOrbSpeak,
        speak,
        cancelSpeech,
        journals,
        fetchJournals,
        hasMoreJournals,
        addJournal,
        routines,
        setRoutines,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
