"use client";

import { useTheme } from "../Providers/ThemeProvider";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full border border-border" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="h-10 w-10 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-primary/10 transition-all duration-300"
    >
      {theme === "light" ? (
        <FiMoon size={20} />
      ) : (
        <FiSun size={20} />
      )}
    </button>
  );
}