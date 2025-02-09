"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isAuthenticated, userRole, logout, guestLogin } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold">SwissMote</h1>
            </Link>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {userRole === "admin" && (
                  <Link href="/admin/events">
                    <Button variant="ghost">Manage Events</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
                <Button variant="ghost" onClick={guestLogin}>
                  Guest Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
