"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";

interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export default function RoutineTracker() {
  const { routines, setRoutines, currentUser } = useAppContext();
  const [currentTime, setCurrentTime] = useState<string>(""); // to show time
  const [currentDate, setCurrentDate] = useState<string>(""); // to show date

  const [loading, setLoading] = useState(false); // to handle loading while api calls
  const [error, setError] = useState<string | null>(null); // handle error while api calls

  const [newRoutine, setNewRoutine] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    priority: "medium",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Calculate progress
  const completedCount = routines.filter((routine) => routine.completed).length;
  const totalCount = routines.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // TIME AND DATE ---------------------------------------
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format time (HH:MM AM/PM)
      const time = now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Format date (DD/MM/YYYY)
      const date = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime(); // run immediately
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  // Add new routine
  const handleAddRoutine = async () => {
    if (!newRoutine.title.trim()) {
      toast.error("Routine title is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/routine/create-routine", {
        ...newRoutine,
      });

      const newItem = {
        ...res.data.routine,
        id: res.data.routine._id, // map _id to id
      };

      setRoutines((prev) => [...prev, newItem]);
      toast.success("Routine added");
      setNewRoutine({ title: "", description: "", priority: "medium" });
      setIsAdding(false);
    } catch (err: any) {
      setError("Failed to add routine.");
      toast.error("Failed to add routine.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion
  const toggleCompletion = async (id: string) => {
    try {
      // Optional: optimistic UI update (optional for faster feel)
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === id
            ? { ...routine, completed: !routine.completed }
            : routine
        )
      );

      // Send toggle request to backend
      const res = await api.patch(`/api/routine/toggle/${id}`);

      // Use updated completion from backend for accuracy
      const updated = res.data.routine;
      toast.success("Routine updated");

      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === id
            ? { ...routine, completed: updated.completed }
            : routine
        )
      );
    } catch (err) {
      toast.error("Failed to toggle completion");
    }
  };

  // Start editing
  const startEditing = (routine: RoutineItem) => {
    setEditingId(routine.id);
    setEditForm({
      title: routine.title,
      description: routine.description || "",
      priority: routine.priority,
    });
  };

  // Save edit
  const saveEdit = () => {
    if (editForm.title.trim() && editingId) {
      setRoutines(
        routines.map((routine) =>
          routine.id === editingId
            ? {
                ...routine,
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                priority: editForm.priority,
              }
            : routine
        )
      );
      setEditingId(null);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", priority: "medium" });
  };

  // Delete routine
  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 font-inter";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get motivational message
  const getMotivationalMessage = () => {
    if (progressPercentage === 100)
      return "🎉 Amazing! You've completed all your routines!";
    if (progressPercentage >= 75) return "🔥 You're crushing it! Almost there!";
    if (progressPercentage >= 50) return "💪 Great progress! Keep going!";
    if (progressPercentage >= 25) return "🌟 Good start! You've got this!";
    return "🚀 Ready to start your day? Let's do this!";
  };

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-6 max-[500px]:px-4 max-[400px]:px-3 ">
      {/* Header */}
      <div className="text-center space-y-2 mb-5 min-[600px]:mb-8">
        <h1 className="text-[26px] min-[600px]:text-3xl font-medium font-sora text-white flex items-center justify-center gap-2">
          <Target className="w-8 h-8 text-blue-600" />
          Daily Routine Tracker
        </h1>
        <p className="text-gray-400 font-sora text-lg mt-3">
          Build better habits, AI will make it best.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="bg-transparent border-none rounded-none shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium font-inter text-white text-lg">
              <Calendar className="w-5 h-5 text-white" />
              Today's Progress
            </span>
            <Badge variant="secondary" className="bg-white font-sora ">
              {completedCount}/{totalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Progress
              value={progressPercentage}
              className="h-8 bg-gray-600 [&>div]:bg-indigo-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white font-sora z-10">
                {progressPercentage}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-200 font-sora text-base font-medium text-center">
              {getMotivationalMessage()}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-base font-light text-gray-400 font-inter">
          {currentTime}
        </span>
        <span className="text-base font-light font-inter text-gray-400">
          {currentDate}
        </span>
      </div>

      {/* Add New Routine */}
      <Card className="mt-10 bg-white/30  py-4 max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-white font-medium font-sora">
              Your Routines
            </span>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="sm"
              className="flex items-center gap-2 bg-white text-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Add Routine
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          {/* Add Form */}
          {isAdding && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <Input
                placeholder="Routine title (e.g., Morning meditation)"
                value={newRoutine.title}
                onChange={(e) =>
                  setNewRoutine({ ...newRoutine, title: e.target.value })
                }
              />
              <Input
                placeholder="Description (optional)"
                value={newRoutine.description}
                onChange={(e) =>
                  setNewRoutine({ ...newRoutine, description: e.target.value })
                }
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <select
                  aria-label="Select priority level"
                  value={newRoutine.priority}
                  onChange={(e) =>
                    setNewRoutine({
                      ...newRoutine,
                      priority: e.target.value as any,
                    })
                  }
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddRoutine}
                  size="sm"
                  className="bg-indigo-500 text-white"
                >
                  <Check className="w-4 h-4 mr-1 " />
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewRoutine({
                      title: "",
                      description: "",
                      priority: "medium",
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Routine List */}
          <div className="space-y-3">
            {routines.length === 0 ? (
              <div className="text-center py-8 text-gray-200">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-white font-sora text-lg">
                  No routines yet. Add your first routine to get started!
                </p>
              </div>
            ) : (
              routines.map((routine) => (
                <div
                  key={routine.id}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    routine.completed
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  {editingId === routine.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Priority:</span>
                        <select
                          aria-label="Select priority level"
                          value={editForm.priority}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              priority: e.target.value as any,
                            })
                          }
                          className="px-3 py-1 border rounded-md text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm">
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex flex-col  gap-3">
                      <Checkbox
                        checked={routine.completed}
                        onCheckedChange={() => toggleCompletion(routine.id)}
                        className="w-5 h-5"
                      />
                      <div className="w-full">
                        <h3
                          className={`font-medium ${routine.completed ? "line-through text-white" : "text-gray-800 "} font-inter`}
                        >
                          {routine.title}
                        </h3>
                        {routine.description && (
                          <p
                            className={`text-sm text-gray-400 ${routine.completed ? "line-through" : ""} font-sora`}
                          >
                            {routine.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between ">
                        <Badge className={getPriorityColor(routine.priority)}>
                          <span className="font-sora capitalize">
                            {routine.priority}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => startEditing(routine)}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button
                            onClick={() => deleteRoutine(routine.id)}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-gray-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
