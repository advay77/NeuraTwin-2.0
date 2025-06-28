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
    <section className="mt-20 bg-gradient-to-b from-black to-[#7B68DA] w-full min-[800px]:px-12 px-6 py-12">
      <main className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Left Heading */}
        <div>
          <motion.h2
            className="font-inter text-[20px] font-medium bg-gradient-to-b from-white via-gray-400 to-indigo-800/10 text-transparent bg-clip-text [-webkit-background-clip:text]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            Still Doubts ?
          </motion.h2>
          <motion.h1
            className="text-[42px] font-sora font-medium leading-tight bg-gradient-to-l from-white to-[#7B68DA] text-transparent bg-clip-text [-webkit-background-clip:text]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Frequently Asked
            <br /> Questions
          </motion.h1>
        </div>

        {/* Right Accordion */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                className="border-b border-gray-200 pb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.1 * index,
                }}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center text-left py-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <motion.h3
                    className="text-lg md:text-xl font-medium font-sora text-white tracking-tight"
                    whileHover={{ scale: 1.03, color: "#A5B4FC" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.question}
                  </motion.h3>
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
                      key="content"
                      initial={{ opacity: 0, height: 0, y: 20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="pb-4 text-gray-300 font-inter"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {item.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </section>
  );
}
