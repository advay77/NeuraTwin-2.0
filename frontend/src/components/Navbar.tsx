"use client";
import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   if (isMenuOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  // }, [isMenuOpen]);

  return (
    <header
      className={`z-50 top-0 left-1/2 -translate-x-1/2 transition-[padding,margin,width,background,box-shadow,transform] duration-500 ease-in-out ${
        isSticky
          ? "fixed bg-gray-200/40 backdrop-blur-sm my-6 shadow-md py-2 px-4 w-[75%] rounded-full"
          : "relative bg-transparent py-4 px-10 w-full"
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

          {/* <button
            onClick={() => setIsMenuOpen(true)}
            className="min-[820px]:hidden text-deep"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button> */}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {/* <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl p-6 flex flex-col gap-6 text-deep  min-[820px]:hidden h-[60vh] rounded-b-lg"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="self-end mb-4 text-primary-blue"
              aria-label="close menu"
            >
              <X size={28} />
            </button>
            <Link href="/">
              <h1 className="text-[28px] font-main font-bold tracking-tight">
                Ziplyt
              </h1>
            </Link>
            <Link
              href="/reachus"
              onClick={() => setIsMenuOpen(false)}
              className="text-[16px] tracking-tight font-poppins font-medium uppercase text-deep hover:text-primary-blue"
            >
              Reach Us
            </Link>

            <Link
              href="/careers"
              onClick={() => setIsMenuOpen(false)}
              className="text-[16px] tracking-tight font-poppins font-medium uppercase text-deep hover:text-primary-blue"
            >
              Careers
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-[16px] tracking-tight font-poppins font-medium uppercase text-deep hover:text-primary-blue"
            >
              About Company
            </Link>
          </motion.div>
        )}
      </AnimatePresence> */}
    </header>
  );
};

export default Navbar;
