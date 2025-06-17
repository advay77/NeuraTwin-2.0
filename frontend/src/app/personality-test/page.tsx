"use client";

import { useState } from "react";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

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

  const getTraitLevel = (score: number) => {
    // Adjusted for 5 questions per trait (max 25 points)
    if (score <= 10) return { level: "Low", color: "bg-red-500" };
    if (score <= 15) return { level: "Moderate", color: "bg-yellow-500" };
    if (score <= 20) return { level: "High", color: "bg-green-500" };
    return { level: "Very High", color: "bg-blue-500" };
  };

  if (showResults) {
    const scores = calculateScores();

    // Log results to console for further analysis
    console.log("Big 5 Personality Test Results:");
    console.log("Openness:", scores.openness);
    console.log("Conscientiousness:", scores.conscientiousness);
    console.log("Extraversion:", scores.extraversion);
    console.log("Agreeableness:", scores.agreeableness);
    console.log("Neuroticism:", scores.neuroticism);
    console.log("Full Results Object:", scores);

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Your Big 5 Personality Results
            </CardTitle>
            <CardDescription>
              Based on your responses to 25 questions across the five major
              personality dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(scores).map(([trait, score]) => {
              const { level, color } = getTraitLevel(score);
              const percentage = (score / 25) * 100;

              return (
                <div key={trait} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {traitNames[trait as keyof typeof traitNames]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {
                          traitDescriptions[
                            trait as keyof typeof traitDescriptions
                          ]
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {score}/25
                      </Badge>
                      <div className="text-sm font-medium">{level}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={percentage}
                      className="h-3 [&>div]:bg-purple-600"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[question.id];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge variant="secondary">
              {traitNames[question.trait as keyof typeof traitNames]}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4 [&>div]:bg-purple-600" />
          <CardTitle className="text-xl">{question.text}</CardTitle>
          <CardDescription>
            Rate how much you agree with this statement
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestion === questions.length - 1
                ? "View Results"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
