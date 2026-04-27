import { motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";

import { formatDateTime, formatRelativeTime } from "../utils/format";

const SavedGridCard = ({ layout, onDelete, onOpen }) => (
  <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.18 }} className="panel-surface p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-display text-xl font-bold text-[var(--text-primary)]">{layout.name}</p>
        <p className="mt-1 text-sm capitalize text-[var(--text-secondary)]">
          {layout.algorithm} - {layout.rows} x {layout.columns}
        </p>
      </div>
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
        {layout.visualizationMode}
      </span>
    </div>

    <div className="mt-5 space-y-2 rounded-[1.5rem] border border-white/10 bg-white/70 p-4 text-sm dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-secondary)]">Updated</span>
        <span className="font-medium text-[var(--text-primary)]">{formatRelativeTime(layout.updatedAt)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-secondary)]">Last used</span>
        <span className="font-medium text-[var(--text-primary)]">{formatDateTime(layout.lastUsedAt)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-secondary)]">Speed</span>
        <span className="font-medium text-[var(--text-primary)]">{layout.speed}</span>
      </div>
    </div>

    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={() => onOpen(layout)}
        className="surface-button flex-1 gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
      >
        <ArrowRight size={16} />
        Open in Visualizer
      </button>
      <button
        type="button"
        onClick={() => onDelete(layout.id)}
        className="surface-button gap-2 border-white/10 bg-white/70 text-rose-500 dark:bg-slate-900/60"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </motion.article>
);

export default SavedGridCard;

