"use client";
import React from "react";
import Link from "next/link";
import AnimatedGradientBackground from "@/components/animation-gradient-background";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradientBackground
        startingGap={120}
        breathing={true}
        gradientColors={[
          "#181825", // deep black-blue
          "#23244A", // dark indigo
          "#312e81", // indigo-900
          "#7B68DA", // accent purple
          "#6366f1", // indigo-500
          "#a5b4fc", // indigo-200
          "#7c3aed", // violet-600
        ]}
        gradientStops={[30, 50, 60, 70, 80, 90, 100]}
        animationSpeed={0.04}
        breathingRange={7}
      />

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center w-full h-full min-[1280px]:px-12 px-6">
        <h2 className="min-[800px]:mt-20 min-[1200px]:mt-36 mb-5 bg-gradient-to-b from-white via-gray-400 to-indigo-800/10 text-transparent bg-clip-text font-sora min-[820px]:text-4xl text-3xl font-normal tracking-tight whitespace-nowrap  text-center ">
          Redefine your-self
        </h2>
        <h1 className="text-center text-white font-medium min-[768px]:text-7xl text-6xl max-[450px]:text-5xl font-orbitron min-[650px]:mb-20 mb-14">
          Your Intelligent{" "}
          <span className="bg-gradient-to-b from-indigo-100 via-indigo-400 to-transparent text-transparent bg-clip-text">
            Reflection
          </span>
        </h1>
        <p className="font-sora min-[768px]:text-2xl text-[20px] bg-gradient-to-b from-white via-gray-400 to-indigo-800/20 text-transparent bg-clip-text [-webkit-background-clip:text] max-w-3xl text-balance text-center">
          Track your evolution. Decode your thoughts. Align with your goals.
          Become a better you.
        </p>

        <div className="flex flex-col w-full items-center justify-center mt-20 gap-5">
          <Link href="/login">
            <button className="bg-gradient-to-b from-indigo-400 to-indigo-700 text-white font-sora px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-colors duration-300">
              Get Started
            </button>
          </Link>
          <p className="font-orbitron underline underline-offset-4 text-gray-400 text-center">
            Terms & Conditions Applied
          </p>
        </div>
      </main>
    </section>
  );
};

export default Hero;
