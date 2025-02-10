"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | "guest">("guest");
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Rehydrate auth state from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role as "admin" | "user" | "guest");
      setUser({ id: "", name: role, email: "" }); // Set basic user info
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
    setUser({ id: "", name: role, email: "" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole("guest");
    setUser(null);
  };

  const guestLogin = () => {
    localStorage.setItem("userRole", "guest");
    setIsAuthenticated(false);
    setUserRole("guest");
    setUser({ id: "guest", name: "Guest", email: "guest@example.com" });
    router.push("/dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole,
        isLoaded,
        login,
        logout,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
