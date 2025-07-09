// src/components/ThemeToggleButton/ThemeToggleButton.tsx
"use client";

import React from 'react';
import styles from "./ThemeToggleButton.module.css";
// Importe o tipo Theme do ThemeManager ou defina-o aqui se preferir,
// mas é melhor importar para manter consistência.
// Se ThemeManager está em src/components/ThemeManager/ThemeManager.tsx:
import { type Theme } from '../ThemeManager/ThemeManager';

interface ThemeToggleButtonProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally render a placeholder or nothing until mounted
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleButton}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggleButton;