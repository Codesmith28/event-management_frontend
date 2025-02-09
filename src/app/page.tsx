"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to SwissMote Event Management Portal
      </h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        SwissMote is your one‐stop solution to manage, create, and attend events
        seamlessly. Whether you are an admin looking to create and manage events
        or a user hoping to attend the most exciting ones, our portal offers an
        intuitive experience for you. Click below to enter the portal.
      </p>
      <Link href={isAuthenticated ? "/dashboard" : "/login"}>
        <Button className="px-8 py-4 text-xl">
          {isAuthenticated ? "Enter Portal" : "Login to Enter Portal"}
        </Button>
      </Link>
    </div>
  );
}
