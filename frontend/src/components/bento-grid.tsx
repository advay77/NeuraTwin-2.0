"use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
import { BrainCircuit, CircuitBoard } from "lucide-react";
import { LuCalendarClock, LuChartScatter } from "react-icons/lu";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";
export default function BentoGrid() {
  return (
    <section>
      <main className="flex items-center justify-evenly">
        {/* 1 */}
        <div className="flex flex-col gap-8">
          <div className="w-[360px] h-[260px] bg-gradient-to-b from-transparent to-gray-900 p-4 font-sora text-white flex flex-col justify-evenly rounded-xl">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center  self-start">
              <CircuitBoard className="text-white" />
            </div>
            <p className="text-left text-balance overflow-hidden text-xl font-medium ">
              Personalised AI , that grows and connects with you , Track you and
              learns daily from you.
            </p>
          </div>
          <div className="w-[360px] h-[260px] bg-gradient-to-b from-transparent to-gray-900 p-4 font-sora text-white flex flex-col justify-evenly rounded-xl">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center  self-start">
              <BrainCircuit className="text-white" />
            </div>
            <p className="text-left text-balance overflow-hidden text-xl font-medium">
              Intelligence that knows best for you. adapts to your needs and
              respond in your best interest.
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="relative bg-gradient-to-b from-transparent via-transparent to-gray-700 px-5 py-8 overflow-hidden h-[600px] rounded-xl">
          <Iphone15Pro className="w-[300px] -mt-32" src="/orbImage.jpg" />
        </div>
        {/* 3 */}
        <div className="flex flex-col gap-8">
          <div className="w-[360px] h-[260px] bg-gradient-to-b from-transparent to-gray-900 p-4 font-sora text-white flex flex-col justify-evenly rounded-xl">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center  self-start">
              <LuChartScatter className="text-white" size={26} />
            </div>
            <p className="text-left text-balance overflow-hidden text-xl font-medium">
              Reflects your own personality. Identifies your real 5 OCEAN
              traits.
            </p>
          </div>
          <div className="w-[360px] h-[260px] bg-gradient-to-b from-transparent to-gray-900 p-4 font-sora text-white flex flex-col justify-evenly rounded-xl">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center  self-start">
              <LuCalendarClock className="text-white" size={26} />
            </div>
            <p className="text-left text-balance overflow-hidden text-xl font-medium">
              Routines and goals are synced and tracked by your own shadow.
              Means you are fully synced with your own AI.
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}
