"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated, userRole } = useAuth();

  const getNavigationPath = () => {
    if (!isAuthenticated) return "/login";
    return userRole === "admin" ? "/admin" : "/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to SwissMote Event Management Portal
      </h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        SwissMote is your one‐stop solution to manage, create, and attend events
        seamlessly.
      </p>
      <Link href={getNavigationPath()}>
        <Button className="px-8 py-4 text-xl">
          {isAuthenticated
            ? `Enter ${userRole === "admin" ? "Admin Portal" : "Portal"}`
            : "Login to Enter Portal"}
        </Button>
      </Link>
    </div>
  );
}
