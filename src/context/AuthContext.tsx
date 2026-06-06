"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "buyer" | "seller" | "admin" | null;

interface AuthContextType {
  role: Role;
  email: string | null;
  isAuthenticated: boolean;
  login: (role: Role, email?: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  email: null,
  isAuthenticated: false,
  login: () => ({ success: false }),
  logout: () => {},
});

const ADMIN_EMAIL = "admin@igo.com";
const ADMIN_PASSWORD = "admin123";
const SELLER_PASSWORD = "seller123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("igo_role") as Role;
    const savedEmail = localStorage.getItem("igo_email");
    if (savedRole === "buyer" || savedRole === "seller" || savedRole === "admin") {
      setRole(savedRole);
      setEmail(savedEmail);
    }
  }, []);

  const login = (newRole: Role, userEmail?: string, password?: string): { success: boolean; error?: string } => {
    // Admin credential check
    if (newRole === "admin") {
      if (userEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return { success: false, error: "Invalid admin credentials. Please check your email and password." };
      }
    }

    // Seller credential check (demo mode: any email + password seller123)
    if (newRole === "seller") {
      if (password !== SELLER_PASSWORD) {
        return { success: false, error: "Invalid seller credentials. Use demo password: seller123" };
      }
    }

    setRole(newRole);
    setEmail(userEmail || null);
    if (newRole) {
      localStorage.setItem("igo_role", newRole);
      if (userEmail) {
        localStorage.setItem("igo_email", userEmail);
      }
    } else {
      localStorage.removeItem("igo_role");
      localStorage.removeItem("igo_email");
    }
    return { success: true };
  };

  const logout = () => {
    setRole(null);
    setEmail(null);
    localStorage.removeItem("igo_role");
    localStorage.removeItem("igo_email");
  };

  return (
    <AuthContext.Provider value={{ role, email, isAuthenticated: !!role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
