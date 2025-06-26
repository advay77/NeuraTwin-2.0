"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  LuAlignLeft,
  LuLogOut,
  LuX,
  LuUser,
  LuSettings,
  LuRefreshCcw,
} from "react-icons/lu";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { logoutAction } from "@/app/login/actions";

interface HeroNavProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const HeroNav: React.FC<HeroNavProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const router = useRouter();
  const { currentUser, setCurrentUser, loading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // LOGOUT FUNCTION-----------------------------
  const handleLogout = async () => {
    try {
      const res = await logoutAction();
      if (res.success) {
        router.push("/login");
        localStorage.removeItem("auth-token");
        toast.success("Logged out successfully");
        // router.push('/login');
        setCurrentUser(null);
      } else {
        toast.error(res.message || "Logout failed");
      }
    } catch (err: any) {
      toast.error(err.response?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-transparent w-full max-[420px]:px-3 max-[600px]:px-6 px-10 py-3 flex items-center justify-between relative z-50">
      {/* MENU */}
      <div>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <LuAlignLeft
            size={24}
            className="text-white cursor-pointer md:scale-x-125"
          />
        </button>
      </div>

      {/* LOGO */}
      <div>
        <h2 className="font-sora font-semibold tracking-tight transition-all duration-300 text-white max-[420px]:text-[20px] max-[500px]:text-[24px] text-[30px]">
          <span className="bg-gradient-to-b from-white via-gray-400 to-indigo-600 text-transparent bg-clip-text [-webkit-background-clip:text]">
            Neura
          </span>
          Twin
        </h2>
      </div>

      {/* PROFILE */}
      <div className="relative flex items-center gap-2 ">
        {loading ? (
          <div className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] rounded-full bg-indigo-500 animate-pulse transition-all duration-200"></div>
        ) : (
          <Image
            onClick={() => setIsOpen((prev) => !prev)}
            src={
              currentUser?.gender?.toLowerCase() === "male"
                ? "/boy1.jpg"
                : "/girl1.jpg"
            }
            alt="Avatar"
            width={0}
            height={0}
            sizes="(min-width: 1000px) 100px, (min-width: 500px) 70px, 45px"
            className="rounded-full w-[45px] sm:w-[50px] xl:w-[60px] h-auto cursor-pointer"
          />
        )}

        {currentUser?.name ? (
          <p className="max-[500px]:hidden font-sora text-white text-[18px] capitalize">
            {currentUser?.name}
          </p>
        ) : (
          <div className="max-[500px]:hidden w-16 h-5 rounded-full bg-gray-400 animate-pulse transition-all duration-300"></div>
        )}

        {/* DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[60px] right-0 w-[220px] sm:w-[260px] bg-white rounded-2xl shadow-lg z-50 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-start">
                  {/* <LuUser size={20} className="mt-0.5 text-gray-600" /> */}
                  <div className="w-5 h-5 rounded-full bg-[#7B61FF] animate-pulse transition-all duration-300"></div>
                  <div>
                    <h4 className="font-semibold text-[16px] text-black capitalize font-sora tracking-tight">
                      {currentUser?.name || "User"}
                    </h4>
                    <p className="text-sm min-[600px]:text-base text-gray-400/80 truncate max-w-[140px] tracking-tighter italic font-outfit">
                      {currentUser?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-indigo-800 cursor-pointer"
                  aria-label="Close dropdown"
                >
                  <LuX size={20} />
                </button>
              </div>

              <hr className="my-2 border-indigo-200" />

              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full text-left text-[16px] font-sora font-medium text-gray-700 hover:text-indigo-600 flex items-center gap-2"
                >
                  <LuUser size={18} />
                  Your Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left text-[16px] font-sora font-medium text-gray-700 hover:text-indigo-600 flex items-center gap-2"
                >
                  <LuSettings size={18} />
                  Settings
                </button>

                <button
                  type="button"
                  className="w-full text-left text-[16px] font-sora font-medium text-indigo-700 hover:text-indigo-800 flex items-center gap-2"
                >
                  <LuRefreshCcw size={18} className="animate-spin-slow" />
                  Sync Now
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-fit text-left text-[16px] font-sora font-medium text-white bg-[#7B61FF] hover:bg-indigo-600 px-3 py-2 rounded-xl flex items-center gap-2"
                >
                  <LuLogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default HeroNav;
