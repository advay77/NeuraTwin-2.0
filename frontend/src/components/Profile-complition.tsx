"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Calendar,
  Users,
  Briefcase,
  Target,
  Mail,
  Shuffle,
  Zap,
  Brain,
  Cpu,
} from "lucide-react";
import Image from "next/image";
import { completeProfileAction } from "./actions";

// interface ProfileData {
//   name: string;
//   email: string;
//   dateOfBirth: string;
//   gender: string;
//   occupation: string;
//   goalTitle: string;
//   goalDescription: string;
//   goalStartDate: string;
//   goalEndDate: string;
// }
interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  // avatar: string;
  goalTitle: string;
  goalDescription: string;
  goalStartDate: string;
  goalEndDate: string;
}

interface GoalSuggestion {
  title: string;
  description: string;
}

const steps = [
  { id: 1, title: "Identity", subtitle: "Neural scan", icon: User },
  { id: 2, title: "Contact", subtitle: "Data link", icon: Mail },
  { id: 3, title: "Timeline", subtitle: "Temporal data", icon: Calendar },
  { id: 4, title: "Identity", subtitle: "Bio markers", icon: Users },
  { id: 5, title: "Status", subtitle: "Role analysis", icon: Briefcase },
  { id: 6, title: "Vision", subtitle: "Goal synthesis", icon: Target },
];

const occupations = [
  "Student",
  "Bachelor Graduate",
  "Master Graduate",
  "Professional",
  "Entrepreneur",
  "Freelancer",
  "Job Seeker",
  "Other",
];

const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

const goalSuggestionsByOccupation: Record<string, GoalSuggestion[]> = {
  Student: [
    {
      title: "Harvard University Admission",
      description:
        "I want to join Harvard University and excel in my chosen field of study by maintaining a high GPA and participating in research opportunities.",
    },
    {
      title: "Master Programming Language",
      description:
        "I aim to become proficient in Python and develop three significant projects to showcase my skills to potential employers.",
    },
    {
      title: "Secure Prestigious Internship",
      description:
        "I want to secure an internship at a leading tech company to gain practical experience and build professional connections in the industry.",
    },
  ],
  "Bachelor Graduate": [
    {
      title: "Land a Position at Google",
      description:
        "I want to secure a role at Google where I can apply my degree knowledge and grow into a senior position within five years.",
    },
    {
      title: "Complete MBA from a Top Business School",
      description:
        "I aim to enhance my business acumen by pursuing an MBA from a top-tier institution to accelerate my career trajectory.",
    },
    {
      title: "Launch a Tech Startup",
      description:
        "I want to build a startup that leverages my technical expertise to solve real-world problems in the healthcare sector.",
    },
  ],
  "Master Graduate": [
    {
      title: "Publish Research in a Leading Journal",
      description:
        "I aim to contribute to my field by publishing groundbreaking research in a top-tier academic journal within the next two years.",
    },
    {
      title: "Secure a Leadership Position",
      description:
        "I want to leverage my advanced degree to secure a senior management role where I can drive strategic initiatives.",
    },
    {
      title: "Develop a Patent",
      description:
        "I aim to develop and patent an innovative solution based on my specialized knowledge that will disrupt the industry.",
    },
  ],
  Professional: [
    {
      title: "Achieve Executive Leadership",
      description:
        "I want to advance to an executive leadership position where I can shape company strategy while maintaining work-life balance.",
    },
    {
      title: "Lead a Major Project",
      description:
        "I aim to successfully lead a high-impact project that significantly increases company revenue and establishes my expertise.",
    },
    {
      title: "Transition to a New Industry",
      description:
        "I want to leverage my transferable skills to successfully pivot to the renewable energy sector and make a meaningful impact.",
    },
  ],
  Entrepreneur: [
    {
      title: "Scale Business to 7 Figures",
      description:
        "I aim to scale my business to seven figures in annual revenue by expanding our product line and entering new markets.",
    },
    {
      title: "Secure Series A Funding",
      description:
        "I want to secure Series A funding to accelerate growth and build a world-class team that shares my vision for innovation.",
    },
    {
      title: "Create a Sustainable Business Model",
      description:
        "I aim to pivot my business model to incorporate sustainable practices while maintaining profitability and market share.",
    },
  ],
  Freelancer: [
    {
      title: "Build a Personal Brand",
      description:
        "I want to establish myself as a thought leader in my niche through consistent content creation and speaking engagements.",
    },
    {
      title: "Create a Passive Income Stream",
      description:
        "I aim to develop digital products that generate passive income, allowing me to scale my impact beyond hourly client work.",
    },
    {
      title: "Secure Long-term Contracts",
      description:
        "I want to transition from short-term projects to long-term retainer contracts with premium clients in my industry.",
    },
  ],
  "Job Seeker": [
    {
      title: "Secure Position in Dream Company",
      description:
        "I aim to land a role at my dream company that aligns with my values and leverages my unique combination of skills.",
    },
    {
      title: "Complete Industry Certification",
      description:
        "I want to enhance my marketability by obtaining key certifications that demonstrate my expertise and commitment.",
    },
    {
      title: "Build a Professional Network",
      description:
        "I aim to expand my professional network through strategic networking and informational interviews with industry leaders.",
    },
  ],
  Other: [
    {
      title: "Achieve Work-Life Harmony",
      description:
        "I want to create a lifestyle where my professional achievements complement my personal well-being and family priorities.",
    },
    {
      title: "Master a New Skill",
      description:
        "I aim to dedicate time to learning a completely new skill that will broaden my horizons and create new opportunities.",
    },
    {
      title: "Make a Community Impact",
      description:
        "I want to develop and lead a community initiative that addresses a local need and creates lasting positive change.",
    },
  ],
};

// Helper function to format date to YYYY-MM-DD for input[type="date"]
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get today's date formatted for input
const today = formatDateForInput(new Date());

// Get date 1 year from now
const oneYearFromNow = formatDateForInput(
  new Date(new Date().setFullYear(new Date().getFullYear() + 1))
);

// AI-style typing effect hook
const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

export default function ProfileCompletion() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    goalTitle: "",
    goalDescription: "",
    goalStartDate: today,
    goalEndDate: oneYearFromNow,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // AI-style messages for each step
  const aiMessages = [
    "Initializing neural interface...",
    "Establishing secure connection...",
    "Analyzing temporal patterns...",
    "Processing biological markers...",
    "Evaluating role parameters...",
    "Synthesizing goal matrix...",
  ];

  const { displayText: aiMessage } = useTypewriter(
    aiMessages[currentStep - 1],
    30
  );

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsCompleted(true);
      }
      setIsScanning(false);
    }, 800);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // STEP VALIDATION-----------------------------------
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.name.trim().length >= 3;

      case 2:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim());

      case 3:
        if (!profileData.dateOfBirth) return false;

        const dob = new Date(profileData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const hasBirthdayPassedThisYear =
          today.getMonth() > dob.getMonth() ||
          (today.getMonth() === dob.getMonth() &&
            today.getDate() >= dob.getDate());

        const effectiveAge = hasBirthdayPassedThisYear ? age : age - 1;

        return effectiveAge >= 10;

      case 4:
        return profileData.gender.trim() !== "";

      case 5:
        return profileData.occupation.trim() !== "";

      case 6:
        const start = new Date(profileData.goalStartDate).toDateString();
        const end = new Date(profileData.goalEndDate).toDateString();

        return (
          profileData.goalTitle.trim().length >= 3 &&
          profileData.goalTitle.trim().length <= 50 &&
          profileData.goalDescription.trim().length >= 10 &&
          profileData.goalDescription.trim().length <= 200 &&
          profileData.goalStartDate !== "" &&
          profileData.goalEndDate !== "" &&
          start !== end
        );

      default:
        return false;
    }
  };

  const getGoalSuggestions = () => {
    if (!profileData.occupation) return goalSuggestionsByOccupation["Other"];
    return (
      goalSuggestionsByOccupation[profileData.occupation] ||
      goalSuggestionsByOccupation["Other"]
    );
  };

  const applyGoalSuggestion = (suggestion: GoalSuggestion) => {
    updateProfileData("goalTitle", suggestion.title);
    updateProfileData("goalDescription", suggestion.description);

    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const getRandomGoalSuggestion = () => {
    const suggestions = getGoalSuggestions();
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  };

  const applyRandomGoalSuggestion = () => {
    const randomSuggestion = getRandomGoalSuggestion();
    applyGoalSuggestion(randomSuggestion);
  };
  // COUNTDOWN--------------------------------
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (isCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isCompleted]);

  // SUBMISSION OF THE DATA ------------------------------------------------
  const submitProfileData = async () => {
    try {
      const response = await completeProfileAction(profileData);

      if (response.success) {
        localStorage.setItem("auth-token", response?.token);
        localStorage.setItem(
          "firstLogin",
          JSON.stringify(response?.firstLogin)
        ); // Store firstLogin
        toast.success("Profile completed!");
        handleRedirect(); // redirect to dashboard
      } else {
        toast.error("Profile submission failed.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Server error. Try again.");
      console.error("❌ API error:", err.response?.data || err.message);
    }
  };

  const handleRedirect = () => {
    setTimeout(() => {
      toast.success("Initializing your Neura Twin...");
      router.push("/home");
    }, 8000);
  };

  // as soon as step is completed , Iscompleted Becomes true... automatically
  useEffect(() => {
    if (isCompleted) {
      submitProfileData();
    }
  }, [isCompleted]);

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#7B68DA] flex items-center justify-center w-full min-[600px]:py-8">
        <Card className="w-full max-w-2xl bg-gray-800 border border-indigo-500/30 backdrop-blur-xl relative z-10 shadow-2xl shadow-indigo-500/20 max-[600px]:rounded-none max-[600px]:border-none max-[600px]:shadow-none max-[600px]:min-h-screen max-[600px]:w-screen">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5 rounded-lg" /> */}
          <CardContent className="p-6 md:px-8 md:py-10 relative z-10">
            <div className="text-center space-y-6">
              {/* AI Success Animation */}

              <h2 className=" font-sora font-medium text-2xl text-white tracking-tight -mt-5 text-left">
                <span className="bg-gradient-to-b from-white via-gray-400 to-indigo-600 text-transparent bg-clip-text [-webkit-background-clip:text]">
                  Neura
                </span>
                Twin
              </h2>

              <h2 className="text-4xl md:text-4xl font-medium font-sora text-white tracking-tight">
                Neural Profile Complete
              </h2>
              <p className="text-indigo-400  text-lg font-inter max-w-sm mx-auto tracking-tight leading-snug ">
                Hey {profileData.name}, your System initialization is
                successful. Welcome OnBoard.
              </p>

              <div className="flex flex-col my-5 gap-4">
                <Image
                  src={
                    profileData.gender?.toLowerCase() === "male"
                      ? "/boy1.jpg"
                      : "/girl2.jpg"
                  }
                  alt="AVATAR"
                  width={180}
                  height={180}
                  className="mx-auto rounded-full "
                />
                <p className=" capitalize font-sora text-xl text-white font-medium">
                  {profileData.name}
                </p>
                <p className=" capitalize font-sora text-lg text-white font-medium">
                  <span className=" text-gray-400 font-inter">Occupation:</span>{" "}
                  {profileData.occupation}
                </p>
                <p className="capitalize font-sora text-lg text-white font-medium">
                  <span className=" text-gray-400 font-inter">Email: </span>
                  {profileData.email}
                </p>
              </div>

              {/* Holographic Profile Summary */}
              <div className="bg-gray-900/40 border border-indigo-500/30 rounded-2xl px-6 py-4 md:px-8 md:py-6 space-y-6 backdrop-blur-sm relative">
                {/* <h3 className="text-xl font-medium text-indigo-300 text-left font-mono">
                  Data Matrix
                </h3> */}

                <div className="grid gap-4 relative z-10">
                  {/* --------------- */}

                  <div className=" space-y-4">
                    <div>
                      <h2 className=" font-sora tracking-tight text-center font-medium text-[18px] text-indigo-500 mb-5">
                        Looks Like You have your very first Goal Set.
                      </h2>
                      <span className="text-white text-sm uppercase tracking-wider block mb-2 font-sora">
                        Goal
                      </span>
                      <h4 className="text-gray-400 font-medium text-[16px] font-inter tracking-tight leading-snug">
                        {profileData.goalTitle}
                      </h4>
                    </div>

                    <div>
                      <span className="text-white text-sm uppercase tracking-wider block mb-2 font-sora">
                        Goal Description
                      </span>
                      <p className="text-gray-400 font-medium text-[16px] font-inter tracking-tight leading-snug">
                        {profileData.goalDescription}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-indigo-400/80 text-sm uppercase tracking-wider block mb-1 font-mono">
                          Goal Starts
                        </span>
                        <span className="text-white font-medium font-inter">
                          {new Date(
                            profileData.goalStartDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-indigo-400/80 text-sm uppercase tracking-wider block mb-1 font-mono">
                          Deadline
                        </span>
                        <span className="text-white font-medium font-inter">
                          {new Date(
                            profileData.goalEndDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                // onClick={submitProfileData}
                className="w-full bg-gradient-to-r from-indigo-400  to-[#7B68DA] hover:from-indigo-500 hover:via-indigo-600 hover:to-indigo-700 text-white font-bold py-5 rounded-xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 border border-indigo-400/30 mt-8"
              >
                <span className="flex items-center gap-2 font-sora">
                  Initializing Your Twin
                  <Brain className="w-4 h-4 text-white" />
                </span>
              </Button>

              <p className="text-center text-gray-400 text-xs mt-4 font-inter">
                You'll be automatically redirected in {countdown} seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#7B68DA] flex items-center justify-center min-[600px]:p-4">
      <Card className="w-full max-w-2xl  bg-gray-900 border border-indigo-800/50 backdrop-blur-xl relative z-10 shadow-2xl shadow-indigo-500/10  max-[600px]:rounded-none max-[600px]:border-none max-[600px]:shadow-none max-[600px]:min-h-screen max-[600px]:w-screen ">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-transparent to-fuchsia-500/5 rounded-lg" /> */}
        <CardContent className="px-5 py-6 md:px-6 md:py-8 relative z-10">
          {/* AI Status Bar */}
          <div className="mb-8 p-4 bg-gray-800 border border-indigo-500/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
              <span className="text-indigo-300 text-sm font-sora">
                {aiMessage}
              </span>
              <div className="max-[360px]:hidden ml-auto flex gap-1">
                <div className="w-1 h-4 bg-gray-400 animate-pulse" />
                <div className="w-1 h-4 bg-indigo-400 animate-pulse delay-100" />
                <div className="w-1 h-4 bg-indigo-600 animate-pulse delay-200" />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-12">
            {/* Holographic Step Indicators */}
            <div className="flex justify-between items-center mb-8 relative">
              {/* Neural connection lines */}
              <div className="absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-gray-500/30 via-indigo-500/30 to-fuchsia-500/30">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-[#7B68DA] transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                >
                  <div className="absolute right-0 top-0 w-2 h-2 bg-indigo-400 rounded-full animate-pulse transform -translate-y-1/2" />
                </div>
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-12 h-12 max-[500px]:w-10 max-[500px]:h-10 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                        isCompleted
                          ? "bg-gradient-to-r from-indigo-300 to-indigo-600 text-black shadow-lg shadow-indigo-500/30"
                          : isActive
                            ? "bg-gray-900 text-indigo-300 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/20"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 font-bold" />
                      ) : (
                        <Icon
                          className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                        />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 border border-indigo-400/50 rounded-full animate-ping" />
                      )}
                    </div>
                    <div className="text-center mt-3 hidden md:block">
                      <div
                        className={`text-xs font-medium transition-colors duration-300 font-inter ${
                          isActive ? "text-indigo-300" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 font-inter">
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Step Info */}
            <div className="md:hidden text-center mb-6">
              <div className="text-indigo-300 font-medium font-inter">
                {steps[currentStep - 1].title}
              </div>
              <div className="text-gray-400 text-sm font-inter">
                {steps[currentStep - 1].subtitle}
              </div>
            </div>

            {/* Holographic Progress Bar */}
            <div className="w-full bg-gray-800/50 rounded-full h-2 mb-2 border border-indigo-500/20">
              <div
                className="bg-gradient-to-r from-indigo-300 to-[#7B68DA] h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 w-1 h-4 bg-indigo-300 transform -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400/80 font-inter">
              <span>Neural Scan {currentStep}</span>
              <span>{steps.length} protocols</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-light bg-clip-text text-white tracking-tight font-sora">
                {currentStep === 1 && "Neural Identity Scan"}
                {currentStep === 2 && "Data Link Protocol"}
                {currentStep === 3 && "Temporal Analysis"}
                {currentStep === 4 && "Bio Marker Detection"}
                {currentStep === 5 && "Role Classification"}
                {currentStep === 6 && "Mission Parameters"}
              </h2>
              <p className="text-gray-400 font-inter text-[16px] capitalize">
                {currentStep === 1 && "Initializing identity matrix..."}
                {currentStep === 2 && "Establishing secure data channel..."}
                {currentStep === 3 && "Analyzing temporal coordinates..."}
                {currentStep === 4 && "Processing biological markers..."}
                {currentStep === 5 && "Evaluating role parameters..."}
                {currentStep === 6 && "Synthesizing mission objectives..."}
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              {currentStep === 1 && (
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-indigo-300 text-[14px] font-medium font-inter"
                  >
                    Your Name:
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="E.g., John Doe"
                    value={profileData.name}
                    onChange={(e) => updateProfileData("name", e.target.value)}
                    className="bg-gray-800 border border-indigo-500/30 text-indigo-100 placeholder:text-indigo-500/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-inter"
                  />
                  {profileData.name.length > 0 &&
                    profileData.name.length < 2 && (
                      <p className="text-red-400 text-xs font-mono">
                        Identity signature too short
                      </p>
                    )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-indigo-300 text-sm font-medium font-mono"
                  >
                    Your Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E.g., John@neural.com"
                    value={profileData.email}
                    onChange={(e) => updateProfileData("email", e.target.value)}
                    className="bg-gray-800 border border-indigo-500/30 text-indigo-100 placeholder:text-indigo-500/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-inter"
                  />
                  {profileData.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email) && (
                      <p className="text-red-400 text-xs font-mono">
                        Invalid data channel format
                      </p>
                    )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <Label
                    htmlFor="dob"
                    className="text-indigo-300 text-sm font-medium font-mono"
                  >
                    Your DOB:
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      updateProfileData("dateOfBirth", e.target.value)
                    }
                    className="bg-gray-800 border border-indigo-500/30 text-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-inter w-full"
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3">
                  <Label className="text-indigo-300 text-sm font-medium font-mono">
                    Gender:
                  </Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) =>
                      updateProfileData("gender", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border border-indigo-500/30 text-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-inter w-full">
                      <SelectValue placeholder="Select your Gender " />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border border-indigo-500/30 backdrop-blur-xl">
                      {genders.map((gender) => (
                        <SelectItem
                          key={gender}
                          value={gender}
                          className="text-indigo-100 hover:bg-indigo-400/30 focus:bg-indigo-400/30 focus:text-white transition-colors duration-200 font-inter"
                        >
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-3">
                  <Label className="text-indigo-300 text-sm font-medium font-inter">
                    Role Classification
                  </Label>
                  <Select
                    value={profileData.occupation}
                    onValueChange={(value) =>
                      updateProfileData("occupation", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border border-indigo-500/30 text-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-inter w-full">
                      <SelectValue placeholder="Select role classification" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border border-indigo-500/30 backdrop-blur-xl">
                      {occupations.map((occupation) => (
                        <SelectItem
                          key={occupation}
                          value={occupation}
                          className="text-indigo-100 hover:bg-indigo-500/30 focus:bg-indigo-500/30 focus:text-white transition-colors duration-200 font-inter"
                        >
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  {/* Mission Title */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="goalTitle"
                        className="text-indigo-300 text-sm font-medium font-inter"
                      >
                        Goal Title
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={applyRandomGoalSuggestion}
                        className="text-gray-400 hover:text-indigo-300 hover:bg-gray-800/50 h-8 px-2 rounded-lg border border-gray-500/30"
                      >
                        <Shuffle className="w-3.5 h-3.5 mr-1" />
                        <span className="text-xs font-mono">Generate</span>
                      </Button>
                    </div>
                    <Input
                      id="goalTitle"
                      ref={titleInputRef}
                      type="text"
                      placeholder="E.g., Project Phoenix"
                      value={profileData.goalTitle}
                      onChange={(e) =>
                        updateProfileData("goalTitle", e.target.value)
                      }
                      className="bg-gray-900/60 border border-indigo-500/30 text-indigo-100 placeholder:text-indigo-500/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-mono"
                    />
                    <p className="text-indigo-500 font-inter text-right text-sm ">
                      {profileData.goalTitle.length}/50
                    </p>
                    {profileData.goalTitle.length > 0 &&
                      profileData.goalTitle.length < 3 && (
                        <p className="text-red-400 text-xs font-mono">
                          Mission codename too short
                        </p>
                      )}
                  </div>

                  {/* Mission Protocol */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="goalDescription"
                      className="text-indigo-300 text-sm font-medium font-inter"
                    >
                      Goal Description
                    </Label>
                    <Textarea
                      id="goalDescription"
                      ref={textareaRef}
                      placeholder="Define mission parameters and objectives for my goal..."
                      value={profileData.goalDescription}
                      onChange={(e) =>
                        updateProfileData("goalDescription", e.target.value)
                      }
                      className="bg-gray-900/60 border border-indigo-500/30 text-indigo-100 placeholder:text-indigo-500/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 min-h-[100px] resize-none rounded-xl backdrop-blur-sm font-outfit"
                    />
                    <div className="flex justify-between text-xs font-outfit">
                      <span
                        className={`${profileData.goalDescription.length >= 10 ? "text-[#7B68DA]" : "text-indigo-500"}`}
                      >
                        {profileData.goalDescription.length >= 10
                          ? "Protocol valid"
                          : "Minimum 10 chars"}
                      </span>
                      <span className="text-indigo-500 font-inter text-sm">
                        {profileData.goalDescription.length}/200
                      </span>
                    </div>
                  </div>

                  {/* Mission Timeline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="startDate"
                        className="text-indigo-300 text-sm font-medium font-mono"
                      >
                        Goal Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={profileData.goalStartDate}
                        onChange={(e) =>
                          updateProfileData("goalStartDate", e.target.value)
                        }
                        className="bg-gray-900/60 border border-indigo-500/30 text-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-mono"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="endDate"
                        className="text-indigo-300 text-sm font-medium font-mono"
                      >
                        Goal Deadline
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={profileData.goalEndDate}
                        onChange={(e) =>
                          updateProfileData("goalEndDate", e.target.value)
                        }
                        className="bg-gray-900/60 border border-indigo-500/30 text-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* AI Mission Suggestions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#7B68DA]" />
                      <span className="text-indigo-300 text-sm font-medium font-sora">
                        AI Suggestions
                      </span>
                    </div>

                    <div className="bg-gray-900/40 border border-indigo-500/20 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-indigo-400/80 text-sm mb-3 font-inter">
                        Neural analysis for role:{" "}
                        <span className="text-[#7B68DA] font-medium">
                          {profileData.occupation || "undefined"}
                        </span>
                      </p>

                      <div className="space-y-3">
                        {getGoalSuggestions().map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => applyGoalSuggestion(suggestion)}
                            className="p-3 rounded-lg bg-gray-800/70 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-400/40 text-indigo-300 hover:text-indigo-100 transition-all duration-300 backdrop-blur-sm cursor-pointer group"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm group-hover:text-fuchsia-300 transition-colors duration-300 font-sora">
                                {suggestion.title}
                              </h4>
                              <Zap className="w-3.5 h-3.5 text-[#7B68DA] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <p className="text-xs text-indigo-400/70 mt-1 line-clamp-2 group-hover:text-indigo-300/90 transition-colors duration-300 font-inter">
                              {suggestion.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Holographic Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="ghost"
                className="text-indigo-400 hover:text-indigo-300 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300  h-10 px-6 rounded-xl border border-indigo-500/20 font-mono"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-indigo-300 to-indigo-600 hover:from-indigo-600 hover:to-indigo-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] h-10 px-6 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 border border-indigo-400/30"
              >
                {currentStep === steps.length ? (
                  <span className="flex items-center gap-2">
                    Execute
                    <Brain className="w-4 h-4 text-white" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
