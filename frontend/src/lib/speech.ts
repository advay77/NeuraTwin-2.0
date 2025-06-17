// lib/speech.ts

type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
};

let cachedVoices: SpeechSynthesisVoice[] = [];

const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        resolve(cachedVoices);
      };
    }
  });
};

export const speak = async (text: string, options: SpeakOptions = {}) => {
  if (!text) return;

  const { rate = 1, pitch = 1, volume = 1, voiceName, lang = "en-US", onStart, onEnd } = options;

  const voices = cachedVoices.length > 0 ? cachedVoices : await loadVoices();

  const utterance = new SpeechSynthesisUtterance(text);

  const selectedVoice =
    voices.find((v) => v.name === voiceName) ||
    voices.find((v) => v.lang === lang);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
};
