"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/User";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useSpeech } from "@/lib/useSpeech";
import { Journal } from "@/types/JournalSchema";

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
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orbSpeak, setOrbSpeak] = useState<boolean>(false);
  const { speak, cancelSpeech, isSpeaking } = useSpeech();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [hasMoreJournals, setHasMoreJournals] = useState(true);

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

  // Sync orbSpeak with isSpeaking
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
