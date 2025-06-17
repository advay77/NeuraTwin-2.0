"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is NeuraTwin?",
    answer:
      "NeuraTwin is your AI-enhanced digital twin that learns from your behavior, mindset, and goals to guide your personal growth. It reflects your evolving personality and keeps you accountable.",
  },
  {
    question: "How does NeuraTwin understand me?",
    answer:
      "NeuraTwin analyzes your interactions, goals, and progress over time using advanced AI and personality models like OCEAN. It builds a unique profile that evolves with you.",
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Absolutely. Your data is encrypted, securely stored, and never shared without your consent. NeuraTwin is designed with privacy and trust at its core.",
  },
  {
    question: "Can NeuraTwin simulate my future?",
    answer:
      "Yes. Based on your current habits, goals, and personality, NeuraTwin can simulate potential future outcomes—helping you visualize where your current path might lead.",
  },
  {
    question: "What makes NeuraTwin different from other AI tools?",
    answer:
      "Unlike generic AI assistants, NeuraTwin becomes a reflection of you. It adapts to your rhythm, speaks your language, and grows alongside you—like a true digital twin.",
  },
];

export function AccordionDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="mt-20 bg-gradient-to-b from-black to-[#7B68DA] w-full px-8 py-12">
      <main className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Left Heading */}
        <div>
          <h2 className="font-inter text-[20px] font-medium bg-gradient-to-b from-white via-gray-400 to-indigo-800/10 text-transparent bg-clip-text [-webkit-background-clip:text]">
            Still Doubts ?
          </h2>
          <h1 className="text-[42px] font-sora font-medium leading-tight bg-gradient-to-l from-white to-[#7B68DA] text-transparent bg-clip-text [-webkit-background-clip:text]">
            Frequently Asked
            <br /> Questions
          </h1>
        </div>

        {/* Right Accordion */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center text-left py-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <h3 className="text-lg md:text-xl font-medium font-sora text-white tracking-tight">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4"
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 text-gray-300 font-inter">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </section>
  );
}
