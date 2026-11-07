"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";
import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, type ThemeId } from "@/lib/themes";

function applyTheme(id: ThemeId) {
  const cl = document.documentElement.classList;
  THEMES.forEach((t) => cl.remove(t.id));
  cl.add(id);
}

export default function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const ref = useRef<HTMLDivElement>(null);

  // Pick up the theme the head script already applied
  useEffect(() => {
    const current = THEMES.find((t) => document.documentElement.classList.contains(t.id));
    if (current) setActive(current.id);
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: ThemeId) => {
    applyTheme(id);
    setActive(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch { }
  };

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[9999] md:bottom-10 md:right-10">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label="Color theme"
            className="absolute bottom-14 right-0 grid w-max grid-cols-5 gap-2 rounded-lg border border-border bg-highlight p-3 shadow-md"
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active === t.id}
                title={t.name}
                aria-label={t.name}
                onClick={() => choose(t.id)}
                className="grid size-8 cursor-pointer place-items-center rounded-md border border-bgc transition hover:scale-110"
                style={{ backgroundColor: t.swatch }}
              >
                {active === t.id && (
                  <Check className="size-5" style={{ color: "light" in t && t.light ? "#0a0a0a" : "#ffffff" }} />
                )}              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change color theme"
        aria-expanded={open}
        className="animate-breathe cursor-pointer rounded-full bg-tgc p-2 shadow-xl shadow-tgc transition-transform"
      >
        <Palette className="size-6 text-white" />
      </button>
    </div>
  );
}