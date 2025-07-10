"use client";
import { useAppContext } from "@/context/AppContext";
import type React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpeech } from "@/lib/useSpeech";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Plus,
  Edit,
  Trash2,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  Rocket,
  Star,
} from "lucide-react";
import api from "@/lib/api";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "paused";
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export default function GoalManager() {
  const { speak, isSpeaking } = useSpeech();
  const { goals, setGoals } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active" as Goal["status"],
    progress: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
      progress: 0,
    });
    setEditingGoal(null);
  };
  // ORB RESPONSES TO SPEAK WHILE CREATING GOAL
  const orbResponses = [
    "Wonderful there! you just created your new goal",
    "I actually love to see this goal getting completed!",
    "Great , I can see your progress. Lest actually start this goal",
    "WOW , i can see you just created new goal , Let me help you suggest some tips to complete it faster.",
    "I am glad, you are actually making progress by creating new goals.",
  ];

  const message = orbResponses[Math.floor(Math.random() * orbResponses.length)];
  // CREATING NEW GOAL -------------------------------------

  const handleCreateGoal = async () => {
    const tempId = Date.now().toString();

    const newGoal = {
      id: tempId,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update UI
    setGoals([...goals, newGoal]);
    setIsDialogOpen(false);
    resetForm();

    const toastId = toast.loading("Creating goal...");

    speak(message, {
      rate: 1,
      pitch: 1.1,
      lang: "en-US",
      voiceName: "Microsoft Hazel - English (United Kingdom)",
    });

    try {
      const res = await api.post("/api/goal/create", {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        // status: formData.status, deafult active !
      });

      const savedGoal = res.data.goal;

      setGoals((prev) =>
        prev.map((g) =>
          g.id === tempId
            ? {
                ...savedGoal,
                id: savedGoal._id,
                createdAt: new Date(savedGoal.createdAt).toISOString(),
                updatedAt: new Date(savedGoal.updatedAt).toISOString(),
              }
            : g
        )
      );

      toast.success("Goal created!", { id: toastId });
    } catch (err) {
      console.error("Goal creation failed:", err);
      setGoals((prev) => prev.filter((g) => g.id !== tempId));
      toast.error("Failed to create goal", { id: toastId });
    }
  };
  // UPDATING GOAL VIA EDIT ICON--------------------------------
  const handleUpdateGoal = () => {
    if (!editingGoal) return;

    const updatedGoals = goals.map((goal) =>
      goal.id === editingGoal.id
        ? { ...goal, ...formData, updatedAt: new Date().toISOString() }
        : goal
    );
    setGoals(updatedGoals);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: goal.status,
      progress: goal.progress,
    });
    setIsDialogOpen(true);
  };

  // DELETE GOALS-----------------------------------------
  // const handleDeleteGoal = (goalId: string) => {
  //   setGoals(goals.filter((goal) => goal.id !== goalId));
  // };
  const handleDeleteGoal = async (goalId: string) => {
    // Optimistic UI update
    const previousGoals = [...goals];
    setGoals(goals.filter((goal) => goal.id !== goalId));

    const toastId = toast.loading("Deleting goal...");

    try {
      await api.delete(`/api/goal/del/${goalId}`);
      toast.success("Goal deleted!", { id: toastId });
    } catch (err) {
      console.error("Failed to delete goal:", err);
      setGoals(previousGoals); // Rollback on error
      toast.error("Failed to delete goal", { id: toastId });
    }
  };

  // UPDATING THE PROGRESS OF GOAL ---------------------------------------------
  const handleQuickProgressUpdate = async (
    goalId: string,
    newProgress: number
  ) => {
    const previousGoals = [...goals];

    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : goal.status,
            updatedAt: new Date().toISOString(),
          }
        : goal
    );

    setGoals(updatedGoals); // Instant UI update

    const toastId = toast.loading("Updating progress...");

    try {
      await api.patch(`/api/goal/update/${goalId}`, {
        progress: newProgress,
      });
      toast.success("Progress updated!", { id: toastId });
    } catch (err) {
      console.error("Failed to update progress:", err);
      setGoals(previousGoals); // Rollback
      toast.error("Failed to update progress", { id: toastId });
    }
  };

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const pausedGoals = goals.filter((goal) => goal.status === "paused");

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return "from-cyan-500 to-blue-500";
      case "completed":
        return "from-emerald-500 to-green-500";
      case "paused":
        return "from-amber-500 to-orange-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getStatusVariant = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "paused":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Chart data preparation
  const chartData = goals.map((goal) => ({
    name:
      goal.title.length > 12 ? goal.title.substring(0, 12) + "..." : goal.title,
    progress: goal.progress,
    status: goal.status,
  }));

  const statusData = [
    { name: "Active", value: activeGoals.length, color: "#06b6d4" },
    { name: "Completed", value: completedGoals.length, color: "#10b981" },
    { name: "Paused", value: pausedGoals.length, color: "#f59e0b" },
  ];

  const progressTrendData = goals.map((goal, index) => ({
    name: `Goal ${index + 1}`,
    progress: goal.progress,
    target: 100,
  }));

  const chartConfig = {
    progress: {
      label: "Progress",
      color: "#06b6d4",
    },
    target: {
      label: "Target",
      color: "#374151",
    },
  };

  return (
    <div className="min-h-screen">
      <div className=" px-4 py-4 sm:p-6 ">
        {/* Futuristic Header */}
        <div className="relative ">
          <div className="relative  p-4 sm:p-8">
            <div className="flex flex-col justify-between items-center gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center w-full text-center">
                  <div className="p-2 bg-gradient-to-r from-[#7b3fe4] to-indigo-500 rounded-xl">
                    <Rocket className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-medium text-white font-sora ">
                      Goal Manager
                    </h1>
                  </div>
                </div>
                <p className="text-slate-400 text-base min-[600px]:text-lg max-w-[400px] font-inter text-center tracking-tight mb-3">
                  Manage your goals and track your progress. This will help your
                  AI to learn more about you!
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={resetForm}
                    className="w-fit mx-auto bg-gradient-to-r from-[#7b3fe4] to-indigo-500  text-white border-0 shadow-lg shadow-pink-500/20 transition-all duration-300 hover:shadow-cyan-500/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[580px] bg-gradient-to-b from-gray-900 to-indigo-950 border border-gray-800 text-white">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-medium text-white font-sora">
                      {editingGoal ? "Edit Goal" : "Create New Goal"}
                    </DialogTitle>
                    <p className="text-slate-400 text-base mt-2 font-inter">
                      {editingGoal
                        ? "Update your goal details below"
                        : "Set up a new goal to track your progress"}
                    </p>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-slate-200 font-medium"
                      >
                        Goal Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Learn React Advanced Concepts"
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-slate-200 font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what you want to achieve with this goal..."
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="startDate"
                          className="text-slate-200 font-medium"
                        >
                          Start Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          className="bg-slate-800/50 border-slate-700/50 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-slate-200 font-medium"
                        >
                          Target Date *
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          className="bg-slate-800/50 border-slate-700/50 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 h-11"
                        />
                      </div>
                    </div>

                    {editingGoal && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="status"
                            className="text-slate-200 font-medium"
                          >
                            Status
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: Goal["status"]) =>
                              setFormData({ ...formData, status: value })
                            }
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white focus:border-cyan-500/50 h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {/* <div className="space-y-2">
                          <Label
                            htmlFor="progress"
                            className="text-slate-200 font-medium"
                          >
                            Progress (%)
                          </Label>
                          <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                progress: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-slate-800/50 border-slate-700/50 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 h-11"
                          />
                        </div> */}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-800/50">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-slate-700 text-white bg-indigo-800 h-11 px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          editingGoal ? handleUpdateGoal : handleCreateGoal
                        }
                        disabled={
                          !formData.title ||
                          !formData.startDate ||
                          !formData.endDate
                        }
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-cyan-600 hover:to-blue-600 text-white h-11 px-8 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                      >
                        {editingGoal ? "Update Goal" : "Create Goal"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 gap-10">
          {/* Futuristic Charts */}
          <div className="gap-4 sm:gap-8 ">
            <ChartCard
              title="Goals Distribution"
              description="Status breakdown of all goals"
            >
              <ChartContainer
                config={{
                  Active: { label: "Active", color: "#06b6d4" },
                  Completed: { label: "Completed", color: "#10b981" },
                  Paused: { label: "Paused", color: "#f59e0b" },
                }}
                className="h-[250px] sm:h-[300px] w-full "
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {statusData.map((entry, index) => (
                        <linearGradient
                          key={index}
                          id={`gradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={entry.color}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor={entry.color}
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#gradient-${index})`}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent className="bg-slate-800/95 border-slate-700 text-white" />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{
                        backgroundColor: entry.color,
                        borderColor: entry.color,
                      }}
                    />
                    <span className="text-sm sm:text-base text-slate-300">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Futuristic Goals Tabs */}
          <div className="bg-white/10 rounded-2xl p-4 sm:p-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700/50 mb-6">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-slate-400"
                >
                  <span className="hidden sm:inline">Active Goals</span>
                  <span className="sm:hidden">Active</span>
                  <span className="ml-1 sm:ml-2">({activeGoals.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="milestones"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-400"
                >
                  <span className="hidden sm:inline">Milestones</span>
                  <span className="sm:hidden">Done</span>
                  <span className="ml-1 sm:ml-2">
                    ({completedGoals.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="paused"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-500 data-[state=active]:text-white text-slate-400"
                >
                  <span className="hidden sm:inline">Paused</span>
                  <span className="sm:hidden">Paused</span>
                  <span className="ml-1 sm:ml-2">({pausedGoals.length})</span>
                </TabsTrigger>
              </TabsList>
              {/* ACTIVE GOALS -------------------------------- */}
              <TabsContent value="active" className="">
                {activeGoals.length === 0 ? (
                  <EmptyState
                    icon={Zap}
                    title="No active goals yet"
                    description="Create your first goal to get started!"
                    gradient="from-indigo-500 to-purple-500"
                  />
                ) : (
                  <div className="h-[340px] overflow-y-auto p-3 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {activeGoals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onDelete={handleDeleteGoal}
                          onProgressUpdate={handleQuickProgressUpdate}
                          getStatusColor={getStatusColor}
                          getStatusVariant={getStatusVariant}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* MILESTONES -------------------------------- */}
              <TabsContent value="milestones" className="">
                {completedGoals.length === 0 ? (
                  <EmptyState
                    icon={Trophy}
                    title="No milestones achieved yet"
                    description="Complete your first goal to unlock achievements!"
                    gradient="from-emerald-500 to-green-500"
                  />
                ) : (
                  <div className="h-[340px] overflow-y-auto p-3 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {completedGoals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onDelete={handleDeleteGoal}
                          onProgressUpdate={handleQuickProgressUpdate}
                          getStatusColor={getStatusColor}
                          getStatusVariant={getStatusVariant}
                          isMilestone
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* ----------- PAUSED GOALS -------------------------------- */}
              <TabsContent value="paused" className="space-y-4">
                {pausedGoals.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No paused goals"
                    description="Goals you pause will appear here"
                    gradient="from-amber-500 to-orange-500"
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {pausedGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEditGoal}
                        onDelete={handleDeleteGoal}
                        onProgressUpdate={handleQuickProgressUpdate}
                        getStatusColor={getStatusColor}
                        getStatusVariant={getStatusVariant}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  bgGradient: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  bgGradient,
}: StatCardProps) {
  return (
    <div className="relative">
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-white">{value}</p>
          </div>
          <div className={`p-2 sm:p-3 bg-gradient-to-r ${gradient} rounded-lg`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="relative">
      <div className="relative bg-white/10  rounded-xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium text-white mb-1 font-sora">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-inter">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  gradient,
}: EmptyStateProps) {
  return (
    <div className="relative">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5 rounded-xl blur-xl`}
      ></div>
      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-8 sm:p-12 text-center">
        <div
          className={`inline-flex p-4 bg-gradient-to-r ${gradient} rounded-full mb-4`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-400 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onProgressUpdate: (goalId: string, progress: number) => void;
  getStatusColor: (status: Goal["status"]) => string;
  getStatusVariant: (
    status: Goal["status"]
  ) => "default" | "secondary" | "outline";
  isMilestone?: boolean;
}

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onProgressUpdate,
  getStatusColor,
  getStatusVariant,
  isMilestone = false,
}: GoalCardProps) {
  const [progressInput, setProgressInput] = useState(goal.progress.toString());

  const handleProgressSubmit = () => {
    const newProgress = Math.min(
      100,
      Math.max(0, Number.parseInt(progressInput) || 0)
    );
    onProgressUpdate(goal.id, newProgress);
    setProgressInput(newProgress.toString());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    new Date(goal.endDate) < new Date() && goal.status !== "completed";

  return (
    <div className="relative">
      {isMilestone && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full shadow-lg shadow-yellow-500/25">
            <Star className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-xl p-4 sm:p-5">
        <div className="flex justify-center text-center mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-medium text-black mb-1 truncate font-sora capitalize">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-sm sm:text-base text-slate-400 line-clamp-2 font-inter ">
                {goal.description}
              </p>
            )}
          </div>
        </div>
        {/* EDIT AND DELETE BUTTON */}
        <div className="flex items-center justify-between px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(goal)}
            className="h-8 w-8 text-indigo-500"
          >
            <Edit className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goal.id)}
            className="h-8 w-8 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <Badge
            variant={getStatusVariant(goal.status)}
            className={`bg-indigo-500 text-white border-0 text-sm font-inter`}
          >
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </Badge>
          {isOverdue && (
            <Badge
              variant="destructive"
              className="text-xs bg-red-500/20 text-red-400 border-red-500/30"
            >
              Overdue
            </Badge>
          )}
        </div> */}

        <div className="space-y-4 mt-3">
          <div>
            <div className="flex justify-between items-center mb-2 font-inter">
              <span className="text-sm font-medium text-gray-400 ">
                Progress
              </span>
              <span className="text-sm text-slate-400">{goal.progress}%</span>
            </div>
            <div className="relative">
              <Progress
                value={goal.progress}
                className="h-2 bg-slate-400 [&>div]:bg-indigo-500"
              />
            </div>
          </div>

          {goal.status !== "completed" && (
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
                className="flex-1 bg-indigo-500/10  text-black font-sora text-sm focus:border-purple-400"
                placeholder="Update progress"
              />
              <Button
                size="sm"
                onClick={handleProgressSubmit}
                className="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white px-3"
              >
                Update
              </Button>
            </div>
          )}

          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-indigo-500">
            <div className="flex justify-between font-inter text-sm">
              <span>Start:</span>
              <span>{formatDate(goal.startDate)}</span>
            </div>
            <div className="flex justify-between font-inter text-sm">
              <span>End:</span>
              <span>{formatDate(goal.endDate)}</span>
            </div>
            <div className="flex justify-between font-inter text-sm">
              <span>Updated:</span>
              <span>{formatDate(goal.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
