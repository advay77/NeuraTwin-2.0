"use client";
import React from "react";
import Spline from "@splinetool/react-spline";
// import { LuArrowUpRight } from "react-icons/lu";
import Link from "next/link";
const Hero = () => {
  return (
    <section className="w-full overflow-hidden relative min-[768px]:px-8 px-4 py-2">
      {/* Background Spline */}
      <div className=" max-[600px]:hidden w-[580px] h-[580px] min-[768px]:w-[32rem] min-[768px]:h-[32rem] min-[1024px]:w-[40rem] min-[1024px]:h-[40rem]  absolute -top-10 left-1/2 -translate-x-1/2 z-0 ">
        <Spline scene="https://prod.spline.design/Wm3OGmA3c7maZLkC/scene.splinecode" />
      </div>

      {/* Text Content */}
      <main className=" z-10 my-10 relative flex flex-col items-center w-full h-full min-[1280px]:px-12 px-6">
        <h2 className="min-[800px]:mt-20 min-[1200px]:mt-36 mb-5 bg-gradient-to-b from-white via-gray-400 to-indigo-800/10 text-transparent bg-clip-text [-webkit-background-clip:text] min-[820px]:text-4xl text-3xl font-normal tracking-tight whitespace-nowrap  font-sora min-[1024px]:self-start text-center min-[1200px]:ml-20 ">
          Redifine your-self
        </h2>
        <h1 className=" text-center text-white min-[768px]:text-7xl text-6xl max-[450px]:text-5xl font-orbitron  min-[650px]:mb-20 mb-14">
          Your Intelligent{" "}
          <span className="bg-gradient-to-b from-indigo-100 via-indigo-400 to-transparent text-transparent bg-clip-text [-webkit-background-clip:text]">
            Reflection
          </span>
        </h1>
        <p className=" font-sora min-[768px]:text-2xl text-[20px] bg-gradient-to-b from-white via-gray-400 to-indigo-800/20 text-transparent bg-clip-text [-webkit-background-clip:text] max-w-3xl text-balance text-center">
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
      <div className="bg-black h-[3rem] w-[9rem] absolute bottom-[100px] right-[90px]"></div>

      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2000px] rounded-[100%] bg-black left-1/2 -translate-x-1/2  top-[calc(100%-140px)] sm:top-[calc(100%-146px)] border-4 border-[#7B68DA] bg-[radial-gradient(closest-side,#000_82%,#7B68DA)]  "></div>
    </section>
  );
};

export default Hero;
