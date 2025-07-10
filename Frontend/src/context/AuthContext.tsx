// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  photo?: string;
  ranking?: number;
  victories?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: Omit<User, "token">, token: string) => void;
  logout: () => void;
  updateUser: (newUserData: Partial<Omit<User, "token">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Tenta carregar o usuário E O TOKEN do localStorage ao iniciar
    try {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser({ ...userData, token });
      }
    } catch (error) {
      console.error(
        "Falha ao carregar dados de autenticação do localStorage",
        error
      );
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: Omit<User, "token">, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", token);
    setUser({ ...userData, token });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
  };

  const updateUser = (newUserData: Partial<Omit<User, "token">>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...newUserData };
      const { token, ...userToStore } = updatedUser;
      localStorage.setItem("user", JSON.stringify(userToStore));

      return updatedUser;
    });
  };

  const value = { user, isLoading, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
