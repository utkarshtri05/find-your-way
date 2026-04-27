import { MoonStar, SunMedium } from "lucide-react";

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="surface-button gap-2 border-white/10 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:bg-white dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
    aria-label="Toggle color theme"
  >
    {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
    <span>{theme === "dark" ? "Light" : "Dark"}</span>
  </button>
);

export default ThemeToggle;

