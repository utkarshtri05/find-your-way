import { Compass, LayoutDashboard, LogOut, Route, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

import { getInitials } from "../utils/format";
import ThemeToggle from "./ThemeToggle";

const linkClasses = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300"
      : "text-[var(--text-secondary)] hover:bg-white/70 hover:text-[var(--text-primary)] dark:hover:bg-slate-900/60"
  }`;

const Navbar = ({ onLogout, theme, onToggleTheme, user }) => (
  <header className="sticky top-0 z-30 border-b border-white/10 bg-[var(--app-bg-soft)] backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg">
          <Compass size={22} />
        </div>
        <div>
          <p className="font-display text-xl font-bold">Find Your Way</p>
          <p className="text-sm text-[var(--text-secondary)]">Shortest path visualization studio</p>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/visualizer" className={linkClasses}>
          <Route size={16} />
          Visualizer
        </NavLink>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/70 px-3 py-2 dark:bg-slate-900/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
            {getInitials(user?.fullName) || <UserCircle2 size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.fullName}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="surface-button gap-2 border-white/10 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:bg-white dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default Navbar;

