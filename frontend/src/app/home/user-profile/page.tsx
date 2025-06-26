"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import UserProfile from "@/components/userProfileData";
const page = () => {
  const { currentUser } = useAppContext();
  if (!currentUser)
    return (
      <p className="w-full h-full flex items-center justify-center text-white text-lg font-orbitron">
        Loading...
      </p>
    );
  return <UserProfile currentUser={currentUser} />;
};

export default page;
