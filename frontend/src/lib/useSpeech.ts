// lib/useSpeech.ts
import { useState } from "react";
import { speak as speakFn, cancelSpeech } from "./speech";

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string, options = {}) => {
    setIsSpeaking(true);
    speakFn(text, {
      ...options,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  return { speak, cancelSpeech, isSpeaking };
};
