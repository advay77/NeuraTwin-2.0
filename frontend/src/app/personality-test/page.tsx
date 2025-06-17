"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import { useSpeech } from "@/lib/useSpeech";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

interface Question {
  id: number;
  text: string;
  trait: string;
  reverse: boolean;
}

const questions: Question[] = [
  // Openness (O) - 5 questions (2 reverse)
  {
    id: 1,
    text: "I enjoy exploring new ideas and concepts.",
    trait: "openness",
    reverse: false,
  },
  {
    id: 2,
    text: "I have a vivid imagination.",
    trait: "openness",
    reverse: false,
  },
  {
    id: 3,
    text: "I am curious about many different things.",
    trait: "openness",
    reverse: false,
  },
  {
    id: 4,
    text: "I prefer routine and familiar activities.",
    trait: "openness",
    reverse: true,
  },
  {
    id: 5,
    text: "I dislike change and new experiences.",
    trait: "openness",
    reverse: true,
  },

  // Conscientiousness (C) - 5 questions (2 reverse)
  {
    id: 6,
    text: "I always finish what I begin.",
    trait: "conscientiousness",
    reverse: false,
  },
  {
    id: 7,
    text: "I pay attention to details.",
    trait: "conscientiousness",
    reverse: false,
  },
  {
    id: 8,
    text: "I like to keep things organized.",
    trait: "conscientiousness",
    reverse: false,
  },
  {
    id: 9,
    text: "I often leave work unfinished.",
    trait: "conscientiousness",
    reverse: true,
  },
  {
    id: 10,
    text: "I am often late to appointments.",
    trait: "conscientiousness",
    reverse: true,
  },

  // Extraversion (E) - 5 questions (2 reverse)
  {
    id: 11,
    text: "I feel comfortable around people.",
    trait: "extraversion",
    reverse: false,
  },
  {
    id: 12,
    text: "I start conversations easily.",
    trait: "extraversion",
    reverse: false,
  },
  {
    id: 13,
    text: "I enjoy meeting new people.",
    trait: "extraversion",
    reverse: false,
  },
  {
    id: 14,
    text: "I avoid social events when possible.",
    trait: "extraversion",
    reverse: true,
  },
  {
    id: 15,
    text: "I prefer to stay in the background.",
    trait: "extraversion",
    reverse: true,
  },

  // Agreeableness (A) - 5 questions (2 reverse)
  {
    id: 16,
    text: "I sympathize with others' feelings easily.",
    trait: "agreeableness",
    reverse: false,
  },
  {
    id: 17,
    text: "I try to be kind to everyone I meet.",
    trait: "agreeableness",
    reverse: false,
  },
  {
    id: 18,
    text: "I trust people easily.",
    trait: "agreeableness",
    reverse: false,
  },
  {
    id: 19,
    text: "I am not interested in other people's problems.",
    trait: "agreeableness",
    reverse: true,
  },
  {
    id: 20,
    text: "I often criticize others harshly.",
    trait: "agreeableness",
    reverse: true,
  },

  // Neuroticism (N) - 5 questions (2 reverse)
  {
    id: 21,
    text: "I often feel anxious or worried.",
    trait: "neuroticism",
    reverse: false,
  },
  {
    id: 22,
    text: "I get stressed out easily.",
    trait: "neuroticism",
    reverse: false,
  },
  {
    id: 23,
    text: "I often feel overwhelmed by emotions.",
    trait: "neuroticism",
    reverse: false,
  },
  {
    id: 24,
    text: "I rarely worry about things.",
    trait: "neuroticism",
    reverse: true,
  },
  {
    id: 25,
    text: "I remain calm under pressure.",
    trait: "neuroticism",
    reverse: true,
  },
];

const traitNames = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism",
};

const traitDescriptions = {
  openness: "Creativity, curiosity, and openness to new experiences",
  conscientiousness: "Organization, discipline, and goal-oriented behavior",
  extraversion: "Sociability, assertiveness, and energy in social situations",
  agreeableness: "Compassion, cooperation, and trust in others",
  neuroticism: "Emotional instability, anxiety, and stress sensitivity",
};

export default function Component() {
  const router = useRouter();
  const { currentUser, loading } = useAppContext();
  const { speak, isSpeaking } = useSpeech();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScores = () => {
    const scores: Record<string, number> = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    questions.forEach((question) => {
      const answer = answers[question.id] || 0;
      const score = question.reverse ? 6 - answer : answer;
      scores[question.trait] += score;
    });

    return scores;
  };

  // const getTraitLevel = (score: number) => {
  //   // Adjusted for 5 questions per trait (max 25 points)
  //   if (score <= 10) return { level: "Low", color: "bg-red-500" };
  //   if (score <= 15) return { level: "Moderate", color: "bg-yellow-500" };
  //   if (score <= 20) return { level: "High", color: "bg-green-500" };
  //   return { level: "Very High", color: "bg-blue-500" };
  // };

  // Countdown trigger on success
  useEffect(() => {
    if (!showResults) return;

    const scores = calculateScores();
    const {
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
    } = scores;

    const allValid = [
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
    ].every((val) => typeof val === "number" && !isNaN(val));

    if (!allValid) {
      toast.error("Invalid scores. Please retake the test.");
      return;
    }

    const payload = {
      O: openness,
      C: conscientiousness,
      E: extraversion,
      A: agreeableness,
      N: neuroticism,
    };

    api
      .post("/api/personality/update", payload)
      .then(() => {
        toast.success("Personality saved successfully!");
        const message = `Wonderful!  ${
          currentUser?.name || "there"
        }, your personality test is complete. This gives me great insight about you.`;

        speak(message, {
          rate: 1,
          pitch: 1.1,
          lang: "en-US",
          voiceName: "Microsoft Hazel - English (United Kingdom)",
        });

        setCountdown(10);
      })
      .catch((err) => {
        console.error("API Error:", err);
        toast.error("Failed to save personality. Try again later.");
      });
  }, [showResults]);

  //  Separate effect just for countdown redirection
  useEffect(() => {
    if (countdown === null) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (!prev || prev === 1) {
          clearInterval(interval);
          router.push("/home");
          document.cookie = "makeOrbSpeak=true; path=/";
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  if (showResults) {
    // console.log("AFTER SUBMISSIONS OF DATA");
    // const scores = calculateScores();

    // console.log("Big 5 Personality Test Results:");
    // console.log("Openness:", scores.openness);
    // console.log("Conscientiousness:", scores.conscientiousness);
    // console.log("Extraversion:", scores.extraversion);
    // console.log("Agreeableness:", scores.agreeableness);
    // console.log("Neuroticism:", scores.neuroticism);
    // console.log("Full Results Object:", scores);

    return (
      <div className="w-full h-screen p-2 sm:p-4 flex items-center justify-center bg-gradient-to-b from-black to-[#7B68DA] relative">
        <div className="max-w-xl w-full space-y-6">
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <h2 className="font-sora font-semibold tracking-tight transition-all duration-300 text-white max-[420px]:text-[20px] max-[500px]:text-[24px] text-[30px]">
              <span className="bg-gradient-to-b from-white via-gray-400 to-indigo-600 text-transparent bg-clip-text [-webkit-background-clip:text]">
                Neura
              </span>
              Twin
            </h2>
          </div>

          <Card className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-6 border-none">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-white text-2xl sm:text-3xl font-semibold font-sora">
                🎉 Congratulations!
              </CardTitle>
              <CardDescription className="text-gray-200 text-sm sm:text-base font-inter leading-relaxed">
                You’ve successfully completed the Big Five Personality Test.
                Based on your responses, your AI twin will now reflect your
                unique personality traits.
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-6 space-y-4 flex flex-col items-center">
              <div className="text-sm text-white/70 italic">
                Your personality data will be used to personalize your NeuraTwin
                experience.
              </div>

              <div className="flex gap-3">
                {/* <a href="/home"> */}
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all whitespace-nowrap font-sora"
                >
                  Initializing Neura Twin
                </button>
                {/* </a> */}
              </div>

              {countdown !== null && (
                <p className="mt-4 text-center text-sm text-gray-200 font-inter flex items-center justify-center whitespace-nowrap w-full">
                  Redirecting in {countdown} second
                  {countdown !== 1 ? "s" : ""}...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[question.id];

  return (
    <div className="w-full h-screen max-[370px]:p-0 p-2 sm:p-4 flex items-center justify-center bg-gradient-to-b from-black to-indigo-500">
      <div className="w-full h-full sm:h-auto sm:max-w-2xl">
        <Card className="h-full sm:h-auto max-[370px]:rounded-none bg-white/80">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="bg-white font-inter">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary">
                {traitNames[question.trait as keyof typeof traitNames]}
              </Badge>
            </div>
            <Progress value={progress} className="mb-4 [&>div]:bg-indigo-500" />
            <CardTitle className="text-xl min-[650px]:text-2xl font-sora capitalize text-black">
              {question.text}
            </CardTitle>
            <CardDescription className="text-sm min-[650px]:text-base font-inter text-gray-600 my-3 tracking-tight leading-snug">
              There is no right or wrong answer. Just your honest opinion. It
              will hardly take 3 minutes to complete.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 ">
            <RadioGroup
              value={currentAnswer?.toString() || ""}
              onValueChange={(value) =>
                handleAnswer(question.id, Number.parseInt(value))
              }
            >
              {[
                { value: 1, label: "Strongly Disagree" },
                { value: 2, label: "Disagree" },
                { value: 3, label: "Neutral" },
                { value: 4, label: "Agree" },
                { value: 5, label: "Strongly Agree" },
              ].map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors bg-white"
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={!currentAnswer}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                {currentQuestion === questions.length - 1
                  ? "View Results"
                  : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
