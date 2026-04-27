import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const SignupPage = ({ theme, onToggleTheme }) => {
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    if (!formState.fullName.trim()) {
      return "Tell us your name to personalize the workspace.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      return "Enter a valid email address.";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(formState.password)) {
      return "Use at least 8 characters with letters and numbers.";
    }

    if (formState.password !== formState.confirmPassword) {
      return "Passwords do not match yet.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await signup({
        fullName: formState.fullName,
        email: formState.email,
        password: formState.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      caption="Create account"
      title="Launch your premium pathfinding workspace"
      subtitle="Save complex mazes, compare algorithms, and keep every routing experiment synced to your account."
      theme={theme}
      onToggleTheme={onToggleTheme}
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-500" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--text-secondary)]">Full name</span>
          <input
            type="text"
            value={formState.fullName}
            onChange={(event) => setFormState((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Aarav Kapoor"
            className="surface-input"
          />
        </label>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="text-[var(--text-secondary)]">Password</span>
            <input
              type="password"
              value={formState.password}
              onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
              placeholder="Strong password"
              className="surface-input"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-[var(--text-secondary)]">Confirm password</span>
            <input
              type="password"
              value={formState.confirmPassword}
              onChange={(event) => setFormState((current) => ({ ...current, confirmPassword: event.target.value }))}
              placeholder="Repeat password"
              className="surface-input"
            />
          </label>
        </div>

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
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
