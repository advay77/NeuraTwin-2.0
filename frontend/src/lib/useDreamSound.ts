// lib/useDreamSound.ts
import { useRef } from "react";
import { Howl } from "howler";

export const useDreamSound = () => {
  const soundRef = useRef<Howl | null>(null);

  const playDreamSound = () => {
    if (!soundRef.current) {
   
      soundRef.current = new Howl({
        src: ["/dream.mp3"],
        loop: true,
        volume: 0.5,
        html5: true,
        onplay: () => console.log("[DreamSound] Playing!"),
        onloaderror: (id, error) =>
          console.error("[DreamSound] Load error:", id, error),
        onplayerror: (id, error) =>
          console.error("[DreamSound] Play error:", id, error),
      });
    }
    soundRef.current.play();
  };

  const stopDreamSound = () => {
    if (soundRef.current) {
      
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }
  };

  return { playDreamSound, stopDreamSound };
};
