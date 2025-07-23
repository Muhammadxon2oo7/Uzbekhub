"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-16 h-9 bg-white/20 dark:bg-white/10 rounded-full relative flex items-center px-1 transition-colors border border-white/30 shadow-inner"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-7 h-7 bg-white text-black dark:bg-black dark:text-white rounded-full flex items-center justify-center shadow-md absolute top-1 left-1 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
