"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import Link from "next/link";

export function ThreeDMarqueeDemoSecond() {
  const images = [
    "marq1.jpg",
    "marq2.jpg",
    "marq3.jpg",
    "marq4.jpg",
    "marq5.png",
    "marq6.png",
    "marq5.png",
    "marq6.png",
    "marq1.jpg",
    "marq2.jpg",
    "marq2.jpg",
    "marq3.jpg",
    "marq7.png",
    "marq8.png",
    "marq9.png",
    "marq7.png",
    "marq8.png",
    "marq9.png",
    "marq1.jpg",
    "marq2.jpg",
    "marq3.jpg",
    "marq4.jpg",
    "marq5.png",
    "marq6.png",
    "marq5.png",
    "marq6.png",
    "marq2.jpg",
    "marq3.jpg",
    "marq7.png",
    "marq8.png",
    "marq9.png",
  ];
  return (
    <div className="relative mx-auto my-20 flex min-[500px]:h-screen max-[500px]:py-10 w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-3xl font-bold font-sora text-balance text-white md:text-4xl lg:text-5xl">
        Unlock the Ultimate Power of AI.
        <span className="relative z-20 inline-block rounded-xl bg-[#7F56D9]/50 px-4 py-1 text-white underline decoration-indigo-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm font-inter max-[450px]:mb-3">
          Upgrage
        </span>{" "}
        Yourself Now.
      </h2>
      <p className="relative z-20 mx-auto max-w-xl py-8 text-center text-sm text-neutral-200 md:text-base font-sora">
        you are just one click away to become the better version of you. Click
        Now and Unlock the Power of AI.
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link href="/login">
          <button className="rounded-md bg-[#7F56D9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
            Unlock Now
          </button>
        </Link>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Read more
        </button>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/60" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
