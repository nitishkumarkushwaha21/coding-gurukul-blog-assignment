"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const themes = [
  { value: "ash", label: "Ash" },
  { value: "stone", label: "Stone" },
  { value: "mist", label: "Mist" }
] as const;

type ThemeName = (typeof themes)[number]["value"];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>("ash");

  useEffect(() => {
    const saved = (localStorage.getItem("ui-theme") as ThemeName | null) ?? "ash";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function updateTheme(nextTheme: ThemeName) {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("ui-theme", nextTheme);
  }

  return (
    <div className="inline-flex items-center rounded-full border bg-background p-1">
      {themes.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => updateTheme(item.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            theme === item.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
