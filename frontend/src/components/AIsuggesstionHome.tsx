// "use client";

// import React from "react";
// import { useAppContext } from "@/context/AppContext";
// import { PersonalityScores } from "@/types/User";

// interface Suggestion {
//   trait: keyof PersonalityScores;
//   question: string;
// }

// const getSuggestion = (
//   trait: keyof PersonalityScores,
//   score: number
// ): Suggestion => {
//   if (score <= 5) {
//     switch (trait) {
//       case "O":
//         return {
//           trait,
//           question:
//             "How can I become more comfortable with unfamiliar situations?",
//         };
//       case "C":
//         return {
//           trait,
//           question: "What systems can help me build structure and routines?",
//         };
//       case "E":
//         return {
//           trait,
//           question: "How do I open up more in social or group settings?",
//         };
//       case "A":
//         return {
//           trait,
//           question: "How can I balance logic with empathy in conversations?",
//         };
//       case "N":
//         return {
//           trait,
//           question: "How do I stay grounded even when facing tough situations?",
//         };
//     }
//   } else if (score <= 10) {
//     switch (trait) {
//       case "O":
//         return {
//           trait,
//           question:
//             "How can I gradually explore new ideas without feeling overwhelmed?",
//         };
//       case "C":
//         return {
//           trait,
//           question:
//             "What habits can increase my attention to detail and consistency?",
//         };
//       case "E":
//         return {
//           trait,
//           question:
//             "How do I grow more comfortable expressing myself in groups?",
//         };
//       case "A":
//         return {
//           trait,
//           question:
//             "What are some ways to be honest while maintaining harmony?",
//         };
//       case "N":
//         return {
//           trait,
//           question:
//             "What are some quick methods to stay emotionally steady under stress?",
//         };
//     }
//   } else if (score <= 15) {
//     switch (trait) {
//       case "O":
//         return {
//           trait,
//           question:
//             "How do I strike the right balance between imagination and practicality?",
//         };
//       case "C":
//         return {
//           trait,
//           question: "What flexible planning strategies suit my personality?",
//         };
//       case "E":
//         return {
//           trait,
//           question:
//             "How can I recharge while maintaining healthy social interaction?",
//         };
//       case "A":
//         return {
//           trait,
//           question: "How can I protect my energy while being kind and fair?",
//         };
//       case "N":
//         return {
//           trait,
//           question:
//             "How do I manage emotions effectively without suppressing them?",
//         };
//     }
//   } else if (score <= 20) {
//     switch (trait) {
//       case "O":
//         return {
//           trait,
//           question:
//             "How can I apply my curiosity and ideas toward meaningful goals?",
//         };
//       case "C":
//         return {
//           trait,
//           question:
//             "How do I stay motivated and avoid burnout while pursuing goals?",
//         };
//       case "E":
//         return {
//           trait,
//           question:
//             "How do I use my social energy to build deeper relationships?",
//         };
//       case "A":
//         return {
//           trait,
//           question:
//             "How can I use empathy as a strength without being taken for granted?",
//         };
//       case "N":
//         return {
//           trait,
//           question:
//             "How can I avoid emotional overload when things don’t go as planned?",
//         };
//     }
//   } else {
//     switch (trait) {
//       case "O":
//         return {
//           trait,
//           question:
//             "How do I turn my creativity into lasting impact and innovation?",
//         };
//       case "C":
//         return {
//           trait,
//           question: "How can I use my discipline to mentor or guide others?",
//         };
//       case "E":
//         return {
//           trait,
//           question:
//             "How do I lead and inspire others through my presence and energy?",
//         };
//       case "A":
//         return {
//           trait,
//           question:
//             "How do I cultivate peace and trust in teams or communities?",
//         };
//       case "N":
//         return {
//           trait,
//           question: "How can I embrace emotional sensitivity as a superpower?",
//         };
//     }
//   }

//   return {
//     trait,
//     question: "What can I do to grow personally?",
//   };
// };

// const AIsuggestionHome = () => {
//   const { currentUser } = useAppContext();
//   const personality = currentUser?.personality;

//   if (!personality) return null;

//   const suggestions: Suggestion[] = (
//     ["O", "C", "E", "A", "N"] as (keyof PersonalityScores)[]
//   ).map((trait) => getSuggestion(trait, personality[trait]));

//   return (
//     <div className="w-full px-3 py-4 my-14">
//       <h2 className="text-[24px] font-medium text-white text-left font-sora mb-5 tracking-tight">
//         🤖 AI Suggestions For You
//       </h2>
//       <div className="flex flex-col gap-4">
//         {suggestions.map((s, idx) => (
//           <button
//             key={idx}
//             className="bg-white/10 hover:bg-white/20 text-white text-base font-medium px-4 py-3 rounded-lg text-left transition duration-200 font-inter tracking-tight leading-snug"
//             onClick={() => console.log("User clicked:", s.question)} // <- Replace with Groq call later
//           >
//             {s.question}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AIsuggestionHome;

"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { PersonalityScores } from "@/types/User";

interface Suggestion {
  trait: keyof PersonalityScores;
  question: string;
}

const isPersonalityFilled = (personality: PersonalityScores): boolean => {
  return (
    typeof personality?.O === "number" &&
    typeof personality?.C === "number" &&
    typeof personality?.E === "number" &&
    typeof personality?.A === "number" &&
    typeof personality?.N === "number"
  );
};

const getSuggestion = (
  trait: keyof PersonalityScores,
  score: number
): Suggestion => {
  if (score <= 5) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How can I become more comfortable with unfamiliar situations?",
        };
      case "C":
        return {
          trait,
          question: "What systems can help me build structure and routines?",
        };
      case "E":
        return {
          trait,
          question: "How do I open up more in social or group settings?",
        };
      case "A":
        return {
          trait,
          question: "How can I balance logic with empathy in conversations?",
        };
      case "N":
        return {
          trait,
          question: "How do I stay grounded even when facing tough situations?",
        };
    }
  } else if (score <= 10) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How can I gradually explore new ideas without feeling overwhelmed?",
        };
      case "C":
        return {
          trait,
          question:
            "What habits can increase my attention to detail and consistency?",
        };
      case "E":
        return {
          trait,
          question:
            "How do I grow more comfortable expressing myself in groups?",
        };
      case "A":
        return {
          trait,
          question:
            "What are some ways to be honest while maintaining harmony?",
        };
      case "N":
        return {
          trait,
          question:
            "What are some quick methods to stay emotionally steady under stress?",
        };
    }
  } else if (score <= 15) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How do I strike the right balance between imagination and practicality?",
        };
      case "C":
        return {
          trait,
          question: "What flexible planning strategies suit my personality?",
        };
      case "E":
        return {
          trait,
          question:
            "How can I recharge while maintaining healthy social interaction?",
        };
      case "A":
        return {
          trait,
          question: "How can I protect my energy while being kind and fair?",
        };
      case "N":
        return {
          trait,
          question:
            "How do I manage emotions effectively without suppressing them?",
        };
    }
  } else if (score <= 20) {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How can I apply my curiosity and ideas toward meaningful goals?",
        };
      case "C":
        return {
          trait,
          question:
            "How do I stay motivated and avoid burnout while pursuing goals?",
        };
      case "E":
        return {
          trait,
          question:
            "How do I use my social energy to build deeper relationships?",
        };
      case "A":
        return {
          trait,
          question:
            "How can I use empathy as a strength without being taken for granted?",
        };
      case "N":
        return {
          trait,
          question:
            "How can I avoid emotional overload when things don’t go as planned?",
        };
    }
  } else {
    switch (trait) {
      case "O":
        return {
          trait,
          question:
            "How do I turn my creativity into lasting impact and innovation?",
        };
      case "C":
        return {
          trait,
          question: "How can I use my discipline to mentor or guide others?",
        };
      case "E":
        return {
          trait,
          question:
            "How do I lead and inspire others through my presence and energy?",
        };
      case "A":
        return {
          trait,
          question:
            "How do I cultivate peace and trust in teams or communities?",
        };
      case "N":
        return {
          trait,
          question: "How can I embrace emotional sensitivity as a superpower?",
        };
    }
  }

  return {
    trait,
    question: "What can I do to grow personally?",
  };
};

const AIsuggestionHome = () => {
  const { currentUser } = useAppContext();
  const personality = currentUser?.personality;

  if (!personality || !isPersonalityFilled(personality)) {
    return (
      <div className="w-full px-3 py-4 my-14 bg-white/10 rounded-xl">
        <h2 className="text-[24px] font-medium text-white text-left font-sora mb-3 tracking-tight">
          🤖 AI Suggestions For You
        </h2>
        <p className="text-white/80 text-base font-inter text-center text-balance">
          Take the{" "}
          <span className="font-light text-white">personality test</span> to
          unlock custom AI suggestions tailored to your traits.
        </p>
      </div>
    );
  }

  const suggestions: Suggestion[] = (
    ["O", "C", "E", "A", "N"] as (keyof PersonalityScores)[]
  ).map((trait) => getSuggestion(trait, personality[trait]));

  return (
    <div className="w-full px-3 py-4 my-14">
      <h2 className="text-[24px] font-medium text-white text-left font-sora mb-5 tracking-tight">
        🤖 AI Suggestions For You
      </h2>
      <div className="flex flex-col gap-4">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            className="bg-white/10 hover:bg-white/20 text-white text-base font-medium px-4 py-3 rounded-lg text-left transition duration-200 font-inter tracking-tight leading-snug"
            onClick={() => console.log("User clicked:", s.question)} // <- Replace with Groq call later
          >
            {s.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIsuggestionHome;
