import { memo } from "react";

const getNodeLabel = (node) => {
  if (node.kind === "start") {
    return "Start node";
  }

  if (node.kind === "end") {
    return "End node";
  }

  if (node.kind === "wall") {
    return "Wall node";
  }

  if (node.kind === "weight") {
    return "Weighted node";
  }

  if (node.status === "path") {
    return "Path node";
  }

  if (node.status === "current") {
    return "Current frontier node";
  }

  if (node.status === "visited") {
    return "Visited node";
  }

  return "Open node";
};

const getNodeClasses = (node) => {
  const baseClasses =
    "relative aspect-square w-full overflow-hidden rounded-[0.7rem] border transition-all duration-200 ease-out";

  if (node.kind === "start") {
    return `${baseClasses} border-emerald-300 bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.24)]`;
  }

  if (node.kind === "end") {
    return `${baseClasses} border-rose-300 bg-rose-500 shadow-[0_0_0_1px_rgba(244,63,94,0.24)]`;
  }

  if (node.kind === "wall") {
    return `${baseClasses} border-slate-700 bg-slate-800`;
  }

  if (node.status === "current") {
    return `${baseClasses} scale-105 border-sky-200 bg-sky-300 shadow-[0_0_0_3px_rgba(56,189,248,0.18)]`;
  }

  if (node.status === "path") {
    return `${baseClasses} border-amber-200 bg-amber-300`;
  }

  if (node.status === "visited") {
    return `${baseClasses} border-cyan-200 bg-cyan-300/90`;
  }

  if (node.kind === "weight") {
    return `${baseClasses} border-orange-200 bg-orange-300`;
  }

  return `${baseClasses} border-white/70 bg-white/80 hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:hover:bg-slate-900`;
};

const GridNode = ({ disabled, node, onPointerDown, onPointerEnter, onPointerUp }) => (
  <button
    type="button"
    disabled={disabled}
    title={getNodeLabel(node)}
    onPointerDown={() => onPointerDown(node.row, node.col)}
    onPointerEnter={() => onPointerEnter(node.row, node.col)}
    onPointerUp={onPointerUp}
    className={getNodeClasses(node)}
    aria-label={getNodeLabel(node)}
  >
    {node.kind === "weight" && <span className="text-xs font-bold text-orange-950">7</span>}
    {node.kind === "start" && <span className="text-lg font-bold text-white">S</span>}
    {node.kind === "end" && <span className="text-lg font-bold text-white">E</span>}
    {node.status === "current" && (
      <span className="absolute inset-1 animate-pulse rounded-[0.55rem] border border-white/40" />
    )}
  </button>
);

export default memo(GridNode, (prevProps, nextProps) => prevProps.node === nextProps.node && prevProps.disabled === nextProps.disabled);

