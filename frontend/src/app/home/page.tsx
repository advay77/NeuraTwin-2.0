"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Orb from "../../components/ui/Orb";
import { useSpeech } from "@/lib/useSpeech";
import styled from "styled-components";
import Cookies from "js-cookie";
import { getSuggestions } from "@/lib/getSuggestion";
import { useRef } from "react";
import { LuBell, LuArrowUpRight, LuRocket } from "react-icons/lu";
import { SuggestionsBar } from "@/components/SuggestionBar";
import { getTraitMessage } from "@/lib/personalityUtils";
// import { useRouter } from "next/navigation";
import PersonalityInsights from "@/components/PersonalityResults";
import GoalsHome from "@/components/GoalsHome";
import AIsuggestionHome from "@/components/AIsuggesstionHome";
import { useAIContext } from "@/context/AiContext";
import { BiLoaderAlt } from "react-icons/bi";
import { set } from "date-fns";
const page = () => {
  const { currentUser, loading, orbSpeak, journals } = useAppContext();
  const { speak, isSpeaking } = useSpeech();
  const {
    aiorbSpeak,
    aiResponse,
    typedText,
    setTypedText,
    showResponse,
    setShowResponse,
    prompt,
    setPrompt,
    handleSubmitPrompt,
    loadingProgress,
    remainingAICount,
    setTypeTextDelayed,
    typeTextDelayed,
  } = useAIContext();

  const suggestions = currentUser ? getSuggestions(currentUser, journals) : [];
  // const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // ------------------------SPEAKING --------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser || isSpeaking) return;

      const userId = currentUser._id;
      const shouldGreet = Cookies.get("firstLogin");
      const testPromptKey = `personalityPrompted_${userId}`;
      const hasPromptedTestToday = Cookies.get(testPromptKey);

      // ----------- PERSONALITY SAFETY CHECKS -------------
      const personality = currentUser?.personality;
      const lastTestDate = personality?.updatedAt;

      const hasPersonality =
        typeof personality?.O === "number" &&
        typeof personality?.C === "number" &&
        typeof personality?.E === "number" &&
        typeof personality?.A === "number" &&
        typeof personality?.N === "number";

      const daysSinceTest = lastTestDate
        ? (Date.now() - new Date(lastTestDate).getTime()) /
          (1000 * 60 * 60 * 24)
        : Infinity;

      const needsTest = !hasPersonality || daysSinceTest >= 7;
      const isNewUser = !hasPersonality;

      // ---------------- MAIN GREETING -------------------
      if (currentUser?.name && shouldGreet) {
        speak(
          `Welcome ${currentUser.name}. I am your own AI-powered twin. I will help you become better. I will guide you through your journey. Are you ready?`,
          {
            rate: 1,
            pitch: 1.1,
            lang: "en-US",
            voiceName: "Microsoft Hazel - English (United Kingdom)",
          }
        );

        Cookies.remove("firstLogin");

        if (needsTest && !hasPromptedTestToday) {
          setTimeout(() => {
            if (!isSpeaking) {
              const testPrompt = isNewUser
                ? "It seems you haven't taken the personality test yet. Let's discover who you really are! Take the personality test now. It will help me understand you better."
                : "It's been a while since your last personality test. Want to check how you've grown?";

              const extraDelay = isNewUser ? 3000 : 0;

              setTimeout(() => {
                speak(testPrompt, {
                  rate: 1,
                  pitch: 1.05,
                  lang: "en-US",
                  voiceName: "Microsoft Hazel - English (United Kingdom)",
                });

                Cookies.set(testPromptKey, "true", { expires: 1 }); // valid for 1 day
              }, extraDelay);
            }
          }, 6000);
        }
      }

      // ---------------- FALLBACK (No greeting) ----------------
      else if (needsTest && !hasPromptedTestToday) {
        const testPrompt = isNewUser
          ? `Hi! ${currentUser.name}. You haven't taken the personality test yet. You must complete it now. It will help me to grow and learn more about you.`
          : "Hey! It's been a week since your last personality test. Let's see how you've evolved.";

        const extraDelay = isNewUser ? 1500 : 0;

        setTimeout(() => {
          speak(testPrompt, {
            rate: 1,
            pitch: 1.05,
            lang: "en-US",
            voiceName: "Microsoft Hazel - English (United Kingdom)",
          });

          Cookies.set(testPromptKey, "true", { expires: 1 });
        }, extraDelay);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser, isSpeaking]);

  // ----------------------PERSONALITY SPEAKING --------------------------
  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce(
      (acc, curr) => {
        const [key, val] = curr.split("=");
        acc[key] = val;
        return acc;
      },
      {} as Record<string, string>
    );

    if (cookies.makeOrbSpeak !== "true" || !currentUser || isSpeaking) return;

    const personality = currentUser?.personality;
    if (!personality) return;

    const { O, C, E, A, N } = personality;

    const messages = [
      getTraitMessage(O, "O"),
      getTraitMessage(C, "C"),
      getTraitMessage(E, "E"),
      getTraitMessage(A, "A"),
      getTraitMessage(N, "N"),
    ];

    const finalMessage = `Hey ${currentUser.name}, I’m your AI twin. Based on your personality test, here’s what I’ve learned: ${messages.join(
      " "
    )} Let’s start your journey of growth together.`;

    speak(finalMessage, {
      rate: 1,
      pitch: 1.1,
      lang: "en-US",
      voiceName: "Microsoft Hazel - English (United Kingdom)",
    });

    document.cookie = "makeOrbSpeak=false; path=/";
  }, [currentUser, isSpeaking]);

  // ---------------------------------------RANDOME GREETING -------------------------------------
  const orbResponses = [
    "Do you need any help? Try asking!",
    "I'm NeuraTwin, your own smart reflection.",
    "Let's start working and grinding together.",
    "Did you click me by mistake? No worries, I'm here to help!",
    "Curious about something? Just ask me.",
  ];
  const handleOrbClick = () => {
    if (isSpeaking) return; // prevent overlapping speeches

    const message =
      orbResponses[Math.floor(Math.random() * orbResponses.length)];

    speak(message, {
      rate: 1,
      pitch: 1.1,
      lang: "en-US",
      voiceName: "Microsoft Hazel - English (United Kingdom)", // or your chosen female voice
    });
  };
  // ------------------------------------------------------------------

  // WORKS FOR INPUT AND AI SUGGESTION TYPING EFFECTS.
  useEffect(() => {
    if (
      !showResponse ||
      !aiResponse?.answer ||
      aiResponse.source === "routine" ||
      aiResponse.source === "goals"
    ) {
      return;
    }
    console.log("user prompt || ai suggestion typing effect working...");

    const text = aiResponse.answer;

    let index = 0;

    const startTypingTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedText((prev) => prev + text.charAt(index));
        index++;
        if (index >= text.length) clearInterval(interval);
      }, 50);
    }, 600);

    return () => {
      clearTimeout(startTypingTimeout);
    };
  }, [showResponse, aiResponse]);

  // USEFEECT FOR ROUTINE & GOALS TYEPEWRITER------------------------
  useEffect(() => {
    if (
      !showResponse ||
      !aiResponse?.answer ||
      !["routine", "goals"].includes(aiResponse.source || "")
    ) {
      return;
    }
    console.log("Routine/Goals typing effect working...");
    const text = aiResponse.answer;
    let index = 0;

    const startTypingTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setTypeTextDelayed((prev) => prev + text.charAt(index));
        index++;
        if (index >= text.length) clearInterval(interval);
      }, 50); // Typing speed
    }, 1500); // Delay for routine responses

    return () => {
      clearTimeout(startTypingTimeout);
    };
  }, [showResponse, aiResponse]);

  // NEW EFFECT: Reset when orb stops speaking-------------------

  const prevOrbSpeakRef = useRef(aiorbSpeak);

  useEffect(() => {
    const wasSpeaking = prevOrbSpeakRef.current;
    const justFinishedSpeaking = wasSpeaking && !aiorbSpeak;

    if (justFinishedSpeaking && showResponse) {
      const timeout = setTimeout(() => {
        setTypedText("");
        setShowResponse(false);
      }, 500);

      return () => clearTimeout(timeout);
    }

    prevOrbSpeakRef.current = aiorbSpeak;
  }, [aiorbSpeak, showResponse]);

  //----------------- TYPE WRITER FOR DYNAMIC HEADING -------------------------
  const greetings = [
    (name: string) => `Welcome ${name}`,
    (name: string) => `How's going ${name}?`,
    (name: string) => `Keep it up ${name}`,
  ];

  const [text, setText] = useState<string>("");
  const [fullText, setFullText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [dayInfo, setDayInfo] = useState({ day: "", year: "" });

  useEffect(() => {
    if (!currentUser?.name) return;

    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setFullText(randomGreeting(currentUser.name));

    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Sunday"
    const year = now.getFullYear().toString(); // e.g., "2025"
    setDayInfo({ day, year });
  }, [currentUser]);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 70);

      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  // console.log("USER WHOLE DATA --------->", currentUser);

  return (
    <section className=" w-full relative">
      <main
        ref={topRef}
        className="p-4 min-[600px]:py-6 min-[600px]:px-8 bg-gradient-to-b from-black to-[#7B68DA] min-h-[calc(100vh-50px)] "
      >
        <div className="parent-container flex flex-col  max-w-[1200px] mx-auto ">
          <p className="text-sm text-gray-200 py-2 px-3 bg-blue-500/30 w-fit mx-auto rounded-full -mt-3 mb-5 text-center flex items-center justify-center gap-2 ">
            <LuRocket size={20} className="text-white" />
            <span className="font-medium text-white font-inter">
              {remainingAICount}
            </span>{" "}
            AI Calls Remaining Today
          </p>

          {loading ? (
            <>
              <div className="w-1/2 h-5 rounded-xl bg-gray-400 animate-pulse duration-500 transition-all"></div>
              <div className="w-1/4 h-3 rounded-xl bg-gray-400 animate-pulse duration-500 transition-all mt-2"></div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-5">
              <div className="flex flex-col">
                <h1 className="font-sora text-left text-[22px] min-[600px]:text-[32px] min-[1000px]:text-[38px] text-white font-medium tracking-tight capitalize text-balance">
                  {text}
                </h1>
                <p className="text-gray-400 font-outfit text-[18px] font-light">
                  {dayInfo.day}, {dayInfo.year}
                </p>
              </div>
              <div className="w-11 h-11 bg-gray-400/30 rounded-lg flex items-center justify-center shrink-0">
                <LuBell size={24} className="text-white" />
              </div>
            </div>
          )}

          <div
            onClick={handleOrbClick}
            className="w-fit scale-125  max-[450px]:scale-110 mx-auto h-[300px] min-[650px]:h-[440px] relative  z-0 mt-10  cursor-pointer min-[700px]:-mt-5"
          >
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={20}
              forceHoverState={false}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sora text-4xl max-[650]:text-3xl text-white flex items-center justify-center">
              {isSpeaking || orbSpeak || aiorbSpeak ? (
                <StyledWrapper>
                  <div className="loading">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </StyledWrapper>
              ) : (
                <h1 className="bg-gradient-to-b from-white via-gray-400/70 to-transparent text-transparent bg-clip-text [-webkit-background-clip:text]">
                  Ask Me!
                </h1>
              )}
            </div>
          </div>
          {/* AI REPONSE */}
          {showResponse ? (
            <div className="w-full min-[700px]:w-[80%]  h-[250px] overflow-y-auto bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 mx-auto my-10 min-[700px]:my-0 scroll-smooth leading-relaxed whitespace-pre-wrap">
              {loadingProgress ? (
                <div className="flex items-center gap-3 justify-center h-full text-gray-200 text-base font-medium font-inter">
                  <p>Thinking</p>
                  <BiLoaderAlt className="animate-spin text-white" size={32} />
                </div>
              ) : (
                <p className="text-white font-sora text-base min-[600px]:text-lg tracking-normal">
                  {aiResponse?.source === "routine" || "goals"
                    ? typeTextDelayed
                    : typedText}
                  <span className="animate-pulse text-xl text-white">|</span>
                </p>
              )}
            </div>
          ) : (
            <>
              {/* AI SUGGESSTIONS SECTION */}
              <div className="my-10 min-[700px]:-mt-3">
                <p className="text-gray-400 font-sora text-xl text-left mb-3">
                  AI Suggestions:
                </p>
                <SuggestionsBar suggestions={suggestions} />
              </div>

              <div className="mt-2 w-full min-[500px]:w-1/2 mx-auto flex items-center justify-between bg-white/30 rounded-full py-2 px-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && prompt.trim() && handleSubmitPrompt()
                  }
                  className="w-full px-2 text-black placeholder:text-gray-200 font-inter focus:outline-none"
                  placeholder="Ask me anything..."
                />
                <div
                  onClick={prompt.trim() ? handleSubmitPrompt : undefined}
                  className={`bg-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    prompt.trim()
                      ? "hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <LuArrowUpRight
                    size={24}
                    className="text-black active:rotate-45"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="bg-gradient-to-b from-[#7B68DA] to-[#3e2f86] px-4 py-8 min-[600px]:pt-20 min-[600px]:pb-10 min-[600px]:px-8  h-full ">
        <div className="flex flex-col max-w-[800px] mx-auto">
          <PersonalityInsights />
          <GoalsHome />
          <AIsuggestionHome onSuggestionClick={scrollToTop} />
        </div>
      </div>
    </section>
  );
};
const StyledWrapper = styled.div`
  .loading {
    --speed-of-animation: 0.9s;
    --gap: 6px;
    --first-color: #7b68da;
    --second-color: #6c53e6;
    --third-color: #7f3ce2;
    --fourth-color: #35a4cc;
    --fifth-color: #fff3ff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    gap: 6px;
    height: 100px;
  }

  .loading span {
    width: 4px;
    height: 50px;
    background: var(--first-color);
    animation: scale var(--speed-of-animation) ease-in-out infinite;
  }

  .loading span:nth-child(2) {
    background: var(--second-color);
    animation-delay: -0.8s;
  }

  .loading span:nth-child(3) {
    background: var(--third-color);
    animation-delay: -0.7s;
  }

  .loading span:nth-child(4) {
    background: var(--fourth-color);
    animation-delay: -0.6s;
  }

  .loading span:nth-child(5) {
    background: var(--fifth-color);
    animation-delay: -0.5s;
  }

  @keyframes scale {
    0%,
    40%,
    100% {
      transform: scaleY(0.05);
    }

    20% {
      transform: scaleY(1);
    }
  }
`;

export default page;
{
  /* <h1 className="text-2xl font-bold text-white">
        Welcome back, {currentUser?.name || "User"}
      </h1>
      <p className="text-gray-400">
        Occupation: {currentUser?.occupation || "Not specified"}
      </p> */
}
