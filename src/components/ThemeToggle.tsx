"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid "Hydration Mismatch" (button flickering on load)
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="p-5" />; 

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-800 transition-all border border-transparent dark:border-zinc-700"
    >
      {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
    </button>
  );
}