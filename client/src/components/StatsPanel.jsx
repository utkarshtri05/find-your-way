import { Activity, BarChart3, Clock3, GitCompareArrows, Route, Scale } from "lucide-react";
import { motion } from "framer-motion";

const StatBlock = ({ icon: Icon, label, value, helper }) => (
  <div className="rounded-[1.5rem] border border-white/10 bg-white/70 p-4 dark:bg-slate-900/60">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-500">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
    {helper && <p className="mt-3 text-sm text-[var(--text-secondary)]">{helper}</p>}
  </div>
);

const comparisonTone = (hasPath) => (hasPath ? "text-emerald-500" : "text-rose-500");

const StatsPanel = ({ comparisonStats, gridSummary, stats, stepDescription }) => (
  <motion.aside
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: 0.06 }}
    className="space-y-6"
  >
    <section className="panel-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Run analytics</p>
          <h2 className="font-display text-xl font-bold">{stats.label}</h2>
        </div>
        <BarChart3 className="text-emerald-500" size={20} />
      </div>

      <div className="mt-5 grid gap-3">
        <StatBlock icon={Activity} label="Visited Nodes" value={stats.visitedCount} helper="How many nodes the frontier expanded through." />
        <StatBlock icon={Route} label="Path Length" value={stats.pathLength} helper="Measured in edge hops from start to end." />
        <StatBlock icon={Scale} label="Path Cost" value={stats.pathCost} helper="Weighted total used by the chosen algorithm." />
        <StatBlock icon={Clock3} label="Time Complexity" value={stats.complexity} helper="Theoretical complexity for the selected algorithm." />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/70 p-4 dark:bg-slate-900/60">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Live narration</p>
        <p className="mt-3 text-sm leading-6 text-[var(--text-primary)]">{stepDescription}</p>
      </div>
    </section>

    <section className="panel-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Grid summary</p>
          <h2 className="font-display text-xl font-bold">Board details</h2>
        </div>
        <GitCompareArrows className="text-sky-500" size={20} />
      </div>

      <div className="mt-5 grid gap-3">
        <StatBlock icon={Route} label="Dimensions" value={`${gridSummary.rows} x ${gridSummary.columns}`} />
        <StatBlock icon={Activity} label="Walls" value={gridSummary.walls} />
        <StatBlock icon={Scale} label="Weighted Nodes" value={gridSummary.weights} />
      </div>
    </section>

    {comparisonStats && (
      <section className="panel-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Comparison</p>
            <h2 className="font-display text-xl font-bold">{comparisonStats.label}</h2>
          </div>
          <GitCompareArrows className="text-amber-500" size={20} />
        </div>
        <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/70 p-4 dark:bg-slate-900/60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Visited</span>
            <span className="font-semibold text-[var(--text-primary)]">{comparisonStats.visitedCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Path length</span>
            <span className="font-semibold text-[var(--text-primary)]">{comparisonStats.pathLength}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Path cost</span>
            <span className="font-semibold text-[var(--text-primary)]">{comparisonStats.pathCost}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Complexity</span>
            <span className="font-semibold text-[var(--text-primary)]">{comparisonStats.complexity}</span>
          </div>
          <p className={`text-sm font-semibold ${comparisonTone(comparisonStats.hasPath)}`}>
            {comparisonStats.hasPath ? "Alternate algorithm found a valid route." : "Alternate algorithm could not reach the goal."}
          </p>
        </div>
      </section>
    )}
  </motion.aside>
);

export default StatsPanel;

