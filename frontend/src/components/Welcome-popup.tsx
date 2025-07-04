"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Brain,
  BookOpen,
  Calendar,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  const features = [
    {
      icon: Brain,
      title: "Meet Your AI",
      description: "Connect with AI companion",
    },
    {
      icon: Sparkles,
      title: "Personality Test",
      description: "Discover insights",
    },
    {
      icon: Calendar,
      title: "Build Routines",
      description: "Create healthy habits",
    },
    {
      icon: BookOpen,
      title: "First Journal",
      description: "Document thoughts",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3"
          >
            <Card className="relative w-full max-w-sm sm:max-w-md bg-white border border-gray-200 shadow-xl overflow-hidden">
              {/* Header with Dark Purple Background */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-purple-800 border-b border-purple-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      Profile Complete
                    </h1>
                    <p className="text-sm text-purple-200">
                      Welcome to Neuratwin
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-white/20 text-purple-200 hover:text-white h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Welcome Message */}
                <div className="text-center">
                  <p className="text-gray-700">
                    Your profile setup is complete. Here's what you can do next:
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-blue-100 p-1.5 rounded-md flex-shrink-0">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        Data Privacy
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your data is encrypted and used only to improve your AI
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-sm px-4 py-2 bg-transparent"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2"
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
