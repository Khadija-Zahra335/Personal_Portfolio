export const THEMES = [
  { id: "theme-1", name: "Deep Teal", swatch: "#0f4d62" },
  { id: "theme-2", name: "Dark Slate Gray", swatch: "#2f4f4f" },
  { id: "theme-3", name: "Slate Gray", swatch: "#5e6673" },
  { id: "theme-4", name: "Charcoal", swatch: "#151520" },
  { id: "theme-5", name: "Cobalt Blue", swatch: "#3a44a0" },
  { id: "theme-6", name: "Royal Purple", swatch: "#5e2aa6" },
  { id: "theme-7", name: "Dark Orchid", swatch: "#822f75" },
  { id: "theme-8", name: "Bronze", swatch: "#7f5c05" },
  { id: "theme-9", name: "Forest Green", swatch: "#355b3a" },
  { id: "theme-10", name: "Rosewood", swatch: "#753c3c" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "theme-1";
export const THEME_STORAGE_KEY = "kz-theme";

/** Runs in <head> before first paint so returning visitors never see a flash of the default palette. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t&&/^theme-(10|[1-9])$/.test(t)){var c=document.documentElement.classList;c.remove("${DEFAULT_THEME}");c.add(t);}}catch(e){}})();`;