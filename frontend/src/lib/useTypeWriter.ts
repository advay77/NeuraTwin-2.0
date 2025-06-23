import { useEffect, useState } from "react";

export function useTypewriter(trigger: boolean, fullText: string, delay = 50) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!trigger || !fullText) return;


    let index = 0;

    // Delay to prevent jumbled first words
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
        if (index >= fullText.length) clearInterval(interval);
      }, delay);
    }, 500); // Optional: tweak for stability

    return () => {
      clearTimeout(startTimeout);
    };
  }, [trigger, fullText, delay]);

  return typedText;
}
