import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const LoginPage = ({ theme, onToggleTheme }) => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formState.email || !formState.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    try {
      setSubmitting(true);
      await login(formState);
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      caption="Welcome back"
      title="Sign in to continue building routes"
      subtitle="Access your saved pathfinding labs, compare algorithms, and pick up right where you left off."
      theme={theme}
      onToggleTheme={onToggleTheme}
      footer={
        <p>
          New to Find Your Way?{" "}
          <Link className="font-semibold text-emerald-500" to="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--text-secondary)]">Email address</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            className="surface-input"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-[var(--text-secondary)]">Password</span>
          <input
            type="password"
            value={formState.password}
            onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter your password"
            className="surface-input"
          />
        </label>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="surface-button w-full gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 py-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && <LoaderCircle size={16} className="animate-spin" />}
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

