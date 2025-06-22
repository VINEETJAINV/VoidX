import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // On mount, sync state with localStorage or system
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("voidx-dark");
    let initial;
    if (stored !== null) {
      initial = stored === "true";
    } else {
      initial = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    setDark(initial);
    if (initial) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("voidx-dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("voidx-dark", "false");
    }
  }, [dark, mounted]);

  if (!mounted) {
    // Optionally, render nothing or a skeleton to avoid SSR mismatch
    return null;
  }

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="ml-4 px-3 py-1 rounded-full bg-white/30 dark:bg-zinc-800/60 backdrop-blur border border-indigo-200 dark:border-indigo-700 shadow-lg hover:scale-110 transition-all duration-300 flex items-center gap-2"
      aria-label="Toggle dark mode"
      style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 200, 0.10)' }}
    >
      <span className="transition-all duration-300 text-xl">
        {dark ? "🌙" : "☀️"}
      </span>
      <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-300 transition-all duration-300">
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
