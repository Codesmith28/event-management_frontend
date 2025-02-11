"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { isAuthenticated, userRole, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <Link href="/">
            <h1 className="text-xl font-bold">SwissMote Events</h1>
          </Link>
        </div>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              {userRole === "admin" ? (
                <Link href="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
