"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  userRole: "admin" | "user" | "guest";
  isLoaded: boolean;
  login: (data: { token: string; role: "admin" | "user" }) => void;
  logout: () => void;
  guestLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userRole: "guest",
  isLoaded: false,
  login: () => {},
  logout: () => {},
  guestLogin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | "guest">("guest");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Rehydrate auth state from localStorage when mounted
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role as "admin" | "user" | "guest");
    }
    setIsLoaded(true);
  }, []);

  const login = ({
    token,
    role,
  }: {
    token: string;
    role: "admin" | "user";
  }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole("guest");
  };

  const guestLogin = () => {
    setIsAuthenticated(true);
    setUserRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: null, userRole, isLoaded, login, logout, guestLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
