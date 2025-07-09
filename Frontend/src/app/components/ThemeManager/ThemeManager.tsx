// NOVO CAMINHO: src/components/ThemeManager/ThemeManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// Este import precisará ser ajustado para o local correto do ThemeToggleButton REAL
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton"; // Exemplo de caminho se o botão estiver em sua própria pasta

export type Theme = "light" | "dark";

const ThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("app-theme") as Theme | null;
      return storedTheme || "light";
    }
    return "light";
  });

  const pathname = usePathname();
  const showThemeButton = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`${theme}-theme`);
    if (typeof window !== "undefined") {
      localStorage.setItem("app-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      {showThemeButton && (
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      )}
      {children}
    </>
  );
};

export default ThemeManager;