import { motion } from "framer-motion";

import { NODE_LEGEND } from "../utils/constants";
import Tooltip from "./Tooltip";
import GridNode from "./GridNode";

const legendToneClasses = {
  start: "bg-emerald-500",
  end: "bg-rose-500",
  wall: "bg-slate-800",
  weight: "bg-orange-300",
  visited: "bg-cyan-300",
  path: "bg-amber-300",
};

const GridBoard = ({
  activeTool,
  grid,
  isInteractionLocked,
  onCellPointerDown,
  onCellPointerEnter,
  onInteractionEnd,
  stepDescription,
}) => (
  <section className="panel-surface flex min-h-[600px] flex-col overflow-hidden">
    <div className="border-b border-[var(--app-border)] px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Grid arena</p>
          <h2 className="font-display text-2xl font-bold">Interactive path canvas</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {NODE_LEGEND.map((item) => (
            <Tooltip key={item.label} content={`${item.label} node meaning in the current run.`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/70 px-3 py-2 text-xs font-medium dark:bg-slate-900/60">
                <span className={`h-3 w-3 rounded-full ${legendToneClasses[item.tone]}`} />
                {item.label}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>

    <div className="border-b border-[var(--app-border)] px-5 py-3 text-sm text-[var(--text-secondary)] sm:px-6">
      <span className="font-semibold text-[var(--text-primary)]">Active tool:</span> {activeTool}
      <span className="mx-3 text-slate-300">|</span>
      <span>{stepDescription}</span>
    </div>

    <div className="map-grid flex-1 overflow-auto p-4 sm:p-6" onPointerLeave={onInteractionEnd}>
      <motion.div
        initial={{ opacity: 0.6, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="mx-auto min-w-max rounded-[2rem] border border-white/10 bg-white/30 p-4 shadow-inner dark:bg-slate-950/20"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(1.75rem, 2.1rem))`,
          gap: "0.38rem",
        }}
      >
        {grid.flat().map((node) => (
          <GridNode
            key={`${node.row}-${node.col}`}
            node={node}
            disabled={isInteractionLocked}
            onPointerDown={onCellPointerDown}
            onPointerEnter={onCellPointerEnter}
            onPointerUp={onInteractionEnd}
          />
        ))}
      </motion.div>
    </div>
  </section>
);

export default GridBoard;

