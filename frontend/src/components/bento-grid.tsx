"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BrainCircuit, Cpu, CircuitBoard } from "lucide-react";
export default function BentoGrid() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const marqueeItems = [
    "Personality Mirroring",
    "Voice Recognition",
    "Sentiment Analysis",
    "Natural Language",
    "Context Awareness",
    "Memory Retention",
    "Emotional Intelligence",
    "Personalized Responses",
    "Adaptive Learning",
    "Multi-lingual Support",
  ];
  const icons = [BrainCircuit, Cpu, CircuitBoard];

  return (
    <div className=" p-6">
      <div className="min-[800px]:max-w-6xl max-w-xl mx-auto">
        <div className="grid grid-cols-1  lg:grid-cols-4 gap-4 max-[600px]:gap-10 h-auto lg:h-[800px]">
          {/* First card - Stats */}
          <div className="group bg-gradient-to-br  from-[#7B68DA] via-indigo-800 to-black rounded-2xl p-6 flex flex-col justify-between  lg:col-span-1 lg:row-span-1 min-h-[260px] hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/25 ">
            <div className="text-sm font-medium text-indigo-500 bg-gray-100 rounded-full px-3 py-1 w-fit font-sora uppercase max-[500px]:self-center max-[500px]:mb-5">
              Preview
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold font-sora text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                AI TWIN
              </div>
              <div
                className="text-indigo-100 font-medium group-hover:text-white transition-colors duration-300 text-[20px] font-inter text-left max-[600px]:text-center
              "
              >
                AI Assistant that is Always Available for your needs.
              </div>
            </div>
          </div>

          {/* Marquee card with scrolling capabilities */}
          <div className="bg-gradient-to-br from-[#7B68DA] via-indigo-800 to-black rounded-2xl p-6 flex flex-col justify-between lg:col-span-1 lg:row-span-1 min-h-[280px] overflow-hidden relative group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
            <div className="text-sm font-medium text-indigo-500 bg-gray-100 rounded-full px-3 py-1 w-fit font-sora uppercase max-[500px]:self-center max-[500px]:mb-5">
              CAPABILITIES
            </div>

            <div className="relative z-10 text-center md:text-left">
              <div className="text-white font-semibold mb-4 font-sora text-3xl leading-snug">
                More Than Your Regular GPT
              </div>

              {/* Marquee container */}
              <div className="relative overflow-hidden h-8">
                <div className="flex animate-marquee2 whitespace-nowrap">
                  {[...marqueeItems, ...marqueeItems].map((item, index) => (
                    <span
                      key={index}
                      className="text-lg text-indigo-100 mx-4 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
          </div>

          {/* Main feature card with cursor tracking */}
          <div className="bg-gradient-to-br from-gray-600  to-gray-950 rounded-2xl p-6 flex flex-col lg:col-span-2 lg:row-span-1 min-h-[280px] relative overflow-hidden group hover:bg-gray-800 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="text-sm font-medium text-indigo-500 bg-gray-100 rounded-full px-3 py-1 w-fit font-sora uppercase max-[500px]:self-center max-[500px]:mb-5">
              Intelligence
            </div>
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300 font-sora">
                  Your Digital Reflection
                </h3>
                <p className="bg-gradient-to-b from-white via-gray-400 to-transparent text-transparent bg-clip-text [-webkit-background-clip:text] text-[20px] leading-relaxed group-hover:text-gray-300 transition-colors duration-300 font-inter">
                  It becomes you — it learns your patterns, understands your
                  mind, and helps you stay accountable in your own language and
                  rhythm.
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-4">
                {icons.map((Icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-all duration-300 hover:scale-110 cursor-pointer"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div> */}
          </div>

          {/* Mobile interface card with pulse animation */}
          <div className="max-[600px]:hidden bg-gradient-to-br from-gray-600  to-gray-950 rounded-2xl  flex flex-col p-4 justify-center items-center  lg:col-span-1 lg:row-span-1 min-h-[280px] group hover:bg-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div>
              <div className="text-sm font-medium text-indigo-500 bg-gray-100 rounded-full px-3 py-1 w-fit font-sora uppercase max-[500px]:self-center mb-5 mx-auto">
                UNLEASH
              </div>

              <Image
                src="/neura1.jpg"
                alt="Phone"
                width={500}
                height={500}
                className="object-cover rounded-xl self-center"
              />
            </div>
            <div>
              <p className="font-sora text-[20px] bg-gradient-to-b from-white via-gray-400 to-indigo-800/20 text-transparent bg-clip-text [-webkit-background-clip:text] mt-5 text-balance text-center self-center">
                Visualize your self-development through AI-powered tracking of
                journals, behaviors, and achievements.
              </p>
            </div>
          </div>

          {/* Gallery/showcase card with image hover effect */}
          <div className="bg-gradient-to-br from-gray-600  to-gray-950 rounded-2xl p-6 flex flex-col lg:col-span-3 lg:row-span-1 min-h-[280px] relative overflow-hidden group hover:bg-gray-800 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-sm font-medium text-indigo-500 bg-gray-100 rounded-full px-3 py-1 w-fit font-sora uppercase max-[500px]:self-center max-[500px]:mb-5">
              EXPERIENCE
            </div>
            <div className="flex-1 flex flex-col md:flex-row items-center text-center md:text-left">
              <div className="flex-1">
                <h3 className="font-semibold mb-3 text-3xl font-sora text-white">
                  THE Power of ultimate{" "}
                  <span className="font-orbitron text-indigo-400">
                    Personalization
                  </span>{" "}
                  and
                  <span className="font-orbitron text-indigo-400">
                    {" "}
                    Adaptability
                  </span>
                </h3>
                <p className="bg-gradient-to-b from-white via-gray-400 to-indigo-800/30 text-transparent bg-clip-text [-webkit-background-clip:text] text-[20px] leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  Engage in natural, flowing conversations with an AI that
                  remembers your preferences, adapts to your communication
                  style, and grows more personalized with every interaction.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {["Voice Chat", "Text Analysis", "Emotional Support"].map(
                    (tag, index) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-indigo-500 text-white font-sora"
                        // style={{ transitionDelay: `${index * 0.1}s` }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="max-[600px]:mt-10 mt-0 md:ml-8 relative">
                <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/neura2.jpg"
                    alt="AI chatbot interface"
                    width={240}
                    height={160}
                    className="object-cover group-hover:brightness-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
            {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
