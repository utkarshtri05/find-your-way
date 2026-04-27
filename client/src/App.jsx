import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VisualizerPage from "./pages/VisualizerPage";

const THEME_STORAGE_KEY = "find-your-way-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const HomeRedirect = ({ isAuthenticated, loading }) => {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-[var(--text-primary)]">
        <div className="rounded-full border border-white/10 px-5 py-3 text-sm">Loading workspace...</div>
      </div>
    );
  }

  return <Navigate replace to={isAuthenticated ? "/dashboard" : "/login"} />;
};

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect isAuthenticated={isAuthenticated} loading={loading} />} />
      <Route path="/login" element={<LoginPage theme={theme} onToggleTheme={toggleTheme} />} />
      <Route path="/signup" element={<SignupPage theme={theme} onToggleTheme={toggleTheme} />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/visualizer" element={<VisualizerPage theme={theme} onToggleTheme={toggleTheme} />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;

