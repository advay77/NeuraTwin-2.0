"use client";
import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      // className={`z-50 top-0 left-1/2 -translate-x-1/2 transition-[padding,margin,width,background,box-shadow,transform] duration-500 ease-in-out ${
      //   isSticky
      //     ? "fixed bg-gray-200/40 backdrop-blur-sm my-6 shadow-md py-2 px-4 w-[75%] rounded-full"
      //     : "relative bg-transparent py-4 px-10 w-full"
      // }`}
      className={`z-50 fixed top-0 left-1/2 -translate-x-1/2 transition-[padding,margin,width,background,box-shadow,transform] duration-500 ease-in-out ${
        isSticky
          ? "bg-gray-200/40 backdrop-blur-sm my-6 shadow-md py-2 px-4 w-[75%] rounded-full"
          : "bg-transparent py-4 px-10 w-full"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* LINKS */}
        <nav className="hidden min-[820px]:inline-flex gap-6 items-center font-inter text-[18px] tracking-tight font-medium text-gray-400">
          <Link href="/reachus" className="hover:text-deep">
            Reach us
          </Link>
          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
          <Link href="/careers" className="hover:text-deep">
            Services
          </Link>
          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
          <Link href="/about" className="hover:text-deep">
            About us
          </Link>
        </nav>

        {/* LOGO (Desktop) */}
        <Link href="/">
          <h2
            className={`font-sora font-semibold tracking-tight transition-all duration-300 text-white  ${
              isSticky ? "text-[26px]" : "text-[30px]"
            }`}
          >
            <span className="bg-gradient-to-b from-white via-gray-400 to-indigo-600 text-transparent bg-clip-text [-webkit-background-clip:text]">
              Neura
            </span>
            Twin
          </h2>
        </Link>

        {/* CTA + Mobile Menu Button */}
        <div className="flex items-center">
          <Link href="/login">
            <button
              className={` min-[820px]:px-5 px-3 py-[6px] transition-all duration-300 bg-gradient-to-r from-indigo-300  to-indigo-700 rounded-lg cursor-pointer ${
                isSticky ? "scale-90" : "scale-100"
              }`}
            >
              <span className="whitespace-pre-wrap text-center font-inter text-[16px] text-white font-medium">
                Log in
              </span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
