import {
  Download,
  Gauge,
  Grid2X2Plus,
  LayoutTemplate,
  Play,
  RotateCcw,
  Save,
  SkipForward,
  SquareMousePointer,
} from "lucide-react";
import { motion } from "framer-motion";

import { ALGORITHMS, DRAW_TOOLS } from "../utils/constants";
import Tooltip from "./Tooltip";

const speedToPercentage = (speed) => Math.round(((speed - 20) / 580) * 100);

const ControlPanel = ({
  algorithm,
  comparisonMode,
  layoutName,
  onAlgorithmChange,
  onComparisonModeChange,
  onExport,
  onLayoutNameChange,
  onPrimaryAction,
  onResetBoard,
  onResetPath,
  onRowsChange,
  onColumnsChange,
  onSave,
  onSpeedChange,
  onStep,
  onToolChange,
  onVisualizationModeChange,
  paused,
  prepared,
  rows,
  columns,
  speed,
  visualizationMode,
  activeTool,
}) => {
  const primaryLabel =
    visualizationMode === "auto" ? (prepared ? (paused ? "Resume Run" : "Pause Run") : "Start Run") : "Prepare Steps";

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="panel-surface h-fit space-y-6 p-5"
    >
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Mission control</p>
            <h2 className="font-display text-xl font-bold">Run the simulation</h2>
          </div>
          <Gauge className="text-emerald-500" size={20} />
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={visualizationMode === "step" && prepared}
            className="surface-button gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Play size={16} />
            {primaryLabel}
          </button>

          {visualizationMode === "step" && prepared && (
            <button
              type="button"
              onClick={onStep}
              className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
            >
              <SkipForward size={16} />
              Next Step
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onResetPath}
              className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
            >
              <SquareMousePointer size={16} />
              Clear Path
            </button>
            <button
              type="button"
              onClick={onResetBoard}
              className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
            >
              <RotateCcw size={16} />
              Reset Board
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Algorithm</h3>
          <LayoutTemplate size={18} className="text-[var(--text-secondary)]" />
        </div>

        <label className="space-y-2 text-sm">
          <span className="text-[var(--text-secondary)]">Select algorithm</span>
          <select value={algorithm} onChange={(event) => onAlgorithmChange(event.target.value)} className="surface-input">
            {ALGORITHMS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "auto", label: "Auto" },
            { id: "step", label: "Step" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onVisualizationModeChange(mode.id)}
              className={`surface-button border-white/10 ${
                visualizationMode === mode.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white/70 text-[var(--text-primary)] dark:bg-slate-900/60"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm dark:bg-slate-900/60">
          <div>
            <p className="font-medium text-[var(--text-primary)]">Comparison mode</p>
            <p className="text-xs text-[var(--text-secondary)]">See Dijkstra and BFS metrics side by side.</p>
          </div>
          <input
            type="checkbox"
            checked={comparisonMode}
            onChange={(event) => onComparisonModeChange(event.target.checked)}
            className="h-5 w-5 rounded border-white/10 text-emerald-500"
          />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Speed & grid</h3>
          <Grid2X2Plus size={18} className="text-[var(--text-secondary)]" />
        </div>

        <label className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Animation speed</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              {speedToPercentage(speed)}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="600"
            step="10"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="range-track"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--text-secondary)]">Rows</span>
            <input
              type="range"
              min="8"
              max="28"
              value={rows}
              onChange={(event) => onRowsChange(Number(event.target.value))}
              className="range-track"
            />
            <div className="rounded-2xl border border-white/10 bg-white/70 px-3 py-2 text-center text-sm font-semibold dark:bg-slate-900/60">
              {rows}
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--text-secondary)]">Columns</span>
            <input
              type="range"
              min="10"
              max="42"
              value={columns}
              onChange={(event) => onColumnsChange(Number(event.target.value))}
              className="range-track"
            />
            <div className="rounded-2xl border border-white/10 bg-white/70 px-3 py-2 text-center text-sm font-semibold dark:bg-slate-900/60">
              {columns}
            </div>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Draw nodes</h3>
          <SquareMousePointer size={18} className="text-[var(--text-secondary)]" />
        </div>
        <div className="grid gap-2">
          {DRAW_TOOLS.map((tool) => (
            <Tooltip key={tool.id} content={tool.description} side="right">
              <button
                type="button"
                onClick={() => onToolChange(tool.id)}
                className={`surface-button w-full justify-between border-white/10 ${
                  activeTool === tool.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white/70 text-[var(--text-primary)] dark:bg-slate-900/60"
                }`}
              >
                <span>{tool.label}</span>
                <span className="text-xs opacity-75">{tool.id === activeTool ? "Active" : "Select"}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Persistence</h3>
          <Save size={18} className="text-[var(--text-secondary)]" />
        </div>
        <label className="space-y-2 text-sm">
          <span className="text-[var(--text-secondary)]">Layout name</span>
          <input
            type="text"
            value={layoutName}
            onChange={(event) => onLayoutNameChange(event.target.value)}
            placeholder="e.g. Weighted Maze"
            className="surface-input"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSave}
            className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
          >
            <Save size={16} />
            Save Grid
          </button>
          <button
            type="button"
            onClick={onExport}
            className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </section>
    </motion.aside>
  );
};

export default ControlPanel;
