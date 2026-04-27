import { motion } from "framer-motion";

import BrandIllustration from "./BrandIllustration";
import ThemeToggle from "./ThemeToggle";

const AuthLayout = ({ caption, children, footer, subtitle, theme, title, onToggleTheme }) => (
  <div className="min-h-screen bg-mesh-light px-4 py-6 dark:bg-mesh-dark sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl justify-end">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>

    <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.15fr,0.85fr]">
      <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
        <BrandIllustration />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.08 }}
        className="panel-surface flex items-center justify-center px-6 py-8 sm:px-10"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-3">
            <span className="eyebrow">{caption}</span>
            <div>
              <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">{title}</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
            </div>
          </div>

          {children}

          <div className="border-t border-[var(--app-border)] pt-4 text-sm text-[var(--text-secondary)]">{footer}</div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;

