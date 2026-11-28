"use client"; // ThemeProvider is a client component

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null); // communication channel

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false); // initialization signal for theme preference

  useEffect(() => {
    const savedTheme = localStorage.getItem("rootscroll-theme"); //utilizing browser API

    const initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme; // <html lang="en" data-theme="{initialTheme}">

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("rootscroll-theme", newTheme);

    document.documentElement.dataset.theme = newTheme;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}