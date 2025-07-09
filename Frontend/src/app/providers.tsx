// src/app/providers.tsx
"use client";

import { AuthProvider } from "../context/AuthContext";

import ThemeManager from "./components/ThemeManager/ThemeManager";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeManager>
        {children}
      </ThemeManager>
    </AuthProvider>
  );
}
