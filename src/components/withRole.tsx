"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface WithRoleProps {
  allowedRoles: ("admin" | "user" | "guest")[];
  children: React.ReactElement<{ readOnly?: boolean }>;
}

export const WithRole: React.FC<WithRoleProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, userRole } = useAuth();

  // If not authenticated or role is not allowed, set to read-only
  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return React.cloneElement(children, { readOnly: true });
  }
  return children;
};
