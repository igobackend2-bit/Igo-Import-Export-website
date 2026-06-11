"use client";

// src/context/AuthContext.tsx
// Firebase-backed auth context — replaces localStorage-only auth.
// Interface is kept identical so all existing components work unchanged.

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  signInWithEmail,
  signOut,
  sendPasswordReset,
  onAuthStateChange,
  getUserRole,
  UserRole,
} from "@/lib/authService";

type Role = UserRole | null;

interface AuthContextType {
  role: Role;
  email: string | null;
  uid: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    role: Role,
    email?: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendReset: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  email: null,
  uid: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  sendReset: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user: User | null) => {
      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
        setEmail(user.email);
        setUid(user.uid);
      } else {
        setRole(null);
        setEmail(null);
        setUid(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (
    _role: Role,
    userEmail?: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userEmail || !password) {
      return { success: false, error: "Email and password are required." };
    }
    try {
      const { user, role: fetchedRole } = await signInWithEmail(userEmail, password);
      setRole(fetchedRole);
      setEmail(user.email);
      setUid(user.uid);
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      let message = "Login failed. Please try again.";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      } else if (code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      } else if (code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    await signOut();
    setRole(null);
    setEmail(null);
    setUid(null);
  };

  const sendReset = async (
    userEmail: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordReset(userEmail);
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      let message = "Could not send reset email.";
      if (code === "auth/user-not-found") message = "No account found with this email.";
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        email,
        uid,
        isAuthenticated: !!role,
        isLoading,
        login,
        logout,
        sendReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
