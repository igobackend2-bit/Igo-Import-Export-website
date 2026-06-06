"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "buyer" | "seller" | null;

interface AuthContextType {
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("igo_role") as Role;
    if (savedRole === "buyer" || savedRole === "seller") {
      setRole(savedRole);
    }
  }, []);

  const login = (newRole: Role) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("igo_role", newRole);
    } else {
      localStorage.removeItem("igo_role");
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("igo_role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
