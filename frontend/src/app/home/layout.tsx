"use client";

import { useState } from "react";
import HeroNav from "@/components/Hero-nav";
import Sidebar from "@/components/Hero-sidebar";
import { AppProvider } from "@/context/AppContext";
import { AIProvider } from "@/context/AiContext";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    // console.log("Toggling sidebar...");
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="bg-gradient-to-b from-black to-[#7B68DA] min-h-screen w-full relative">
      <AppProvider>
        <AIProvider>
          <HeroNav
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <main className="">{children}</main>
        </AIProvider>
      </AppProvider>
    </section>
  );
}
