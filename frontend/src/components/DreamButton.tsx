"use client";
import React from "react";
import { Meteors } from "@/components/magicui/meteors";
import { LuBrain } from "react-icons/lu";
import Link from "next/link";
const DreamButton = () => {
  return (
    <div className="relative overflow-hidden h-[300px] w-full max-w-[400px] mx-auto min-[600px]:hidden bg-gradient-to-br from-white/10 to-gray-800/30 rounded-xl ">
      <Meteors />
      <div className="p-5 flex flex-col items-center justify-center h-full gap-6">
        <h1 className=" font-sora font-medium tracking-tight text-3xl text-center  bg-gradient-to-b from-white via-gray-200 to-indigo-800/10 text-transparent bg-clip-text [-webkit-background-clip:text]  ">
          Unlock The Power Of Your Dreams
        </h1>
        <Link href="/home/dream-mode">
          <button
            type="button"
            className="text-white px-6 py-2 rounded-xl bg-indigo-500 text-lg font-inter"
          >
            Dream <LuBrain className="inline text-white" />
          </button>
        </Link>

        <p className="text-sm font-light font-sora text-gray-200/50 text-center">
          NeuraTwin will simulate your future and tell you about your potential.
        </p>
      </div>
    </div>
  );
};

export default DreamButton;
//
