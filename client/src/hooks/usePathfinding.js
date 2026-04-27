import { useCallback, useEffect, useRef, useState } from "react";

import { runAlgorithm } from "../utils/algorithms";
import { clearGridStatuses, setNodeStatus } from "../utils/grid";

const getAlternateAlgorithm = (algorithm) => (algorithm === "dijkstra" ? "bfs" : "dijkstra");

const resolveIdleStatus = (node) => (node.kind === "start" || node.kind === "end" ? "idle" : "visited");

export const usePathfinding = ({
  algorithm,
  comparisonMode,
  endNode,
  grid,
  setGrid,
  speed,
  startNode,
  visualizationMode,
}) => {
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [stats, setStats] = useState({
    label: "Dijkstra",
    complexity: "O((V + E) log V)",
    visitedCount: 0,
    pathLength: 0,
    pathCost: 0,
    hasPath: false,
  });
  const [comparisonStats, setComparisonStats] = useState(null);
  const [stepDescription, setStepDescription] = useState("Choose an algorithm and press Start.");

  const activeNodeRef = useRef(null);
  const finalResultRef = useRef(null);
  const comparisonResultRef = useRef(null);
  const progressRef = useRef({ visited: 0, path: 0 });

  const clearCurrentMarker = useCallback((preserveGrid = false) => {
    if (!activeNodeRef.current) {
      return;
    }

    if (!preserveGrid) {
      setGrid((currentGrid) => {
        const node = currentGrid[activeNodeRef.current.row][activeNodeRef.current.col];
        return setNodeStatus(currentGrid, activeNodeRef.current, resolveIdleStatus(node));
      });
    }

    activeNodeRef.current = null;
  }, [setGrid]);

  const resetVisualization = useCallback(({ preserveGrid = false } = {}) => {
    setSteps([]);
    setStepIndex(0);
    setAutoRunning(false);
    setPaused(false);
    setPrepared(false);
    setComparisonStats(null);
    setStepDescription("Grid reset. Ready for another run.");
    finalResultRef.current = null;
    comparisonResultRef.current = null;
    progressRef.current = { visited: 0, path: 0 };
    clearCurrentMarker(preserveGrid);

    if (!preserveGrid) {
      setGrid((currentGrid) => clearGridStatuses(currentGrid));
    }

    setStats((current) => ({
      ...current,
      visitedCount: 0,
      pathLength: 0,
      pathCost: 0,
      hasPath: false,
    }));
  }, [clearCurrentMarker, setGrid]);

  const finalizeRun = useCallback(() => {
    clearCurrentMarker();
    const finalResult = finalResultRef.current;

    if (finalResult) {
      setStats({
        label: finalResult.label,
        complexity: finalResult.complexity,
        visitedCount: finalResult.visitedCount,
        pathLength: finalResult.pathLength,
        pathCost: finalResult.pathCost,
        hasPath: finalResult.hasPath,
      });

      setStepDescription(
        finalResult.hasPath
          ? `${finalResult.label} completed. Shortest path traced successfully.`
          : `${finalResult.label} finished. No path could reach the destination.`
      );
    }

    if (comparisonResultRef.current) {
      setComparisonStats(comparisonResultRef.current);
    }

    setAutoRunning(false);
    setPaused(false);
    setPrepared(false);
    setSteps([]);
    setStepIndex(0);
  }, [clearCurrentMarker]);

  const applyStep = useCallback((step) => {
    if (step.type === "visit") {
      setGrid((currentGrid) => {
        let nextGrid = currentGrid;

        if (activeNodeRef.current) {
          const previousNode = nextGrid[activeNodeRef.current.row][activeNodeRef.current.col];
          nextGrid = setNodeStatus(nextGrid, activeNodeRef.current, resolveIdleStatus(previousNode));
        }

        nextGrid = setNodeStatus(nextGrid, step.node, "current");
        return nextGrid;
      });

      activeNodeRef.current = step.node;
      progressRef.current.visited += 1;
      setStepDescription(`Exploring node (${step.node.row + 1}, ${step.node.col + 1})`);
      setStats((current) => ({
        ...current,
        visitedCount: progressRef.current.visited,
      }));
      return;
    }

    if (step.type === "path") {
      setGrid((currentGrid) => {
        let nextGrid = currentGrid;

        if (activeNodeRef.current) {
          const previousNode = nextGrid[activeNodeRef.current.row][activeNodeRef.current.col];
          nextGrid = setNodeStatus(nextGrid, activeNodeRef.current, resolveIdleStatus(previousNode));
        }

        activeNodeRef.current = null;
        return setNodeStatus(nextGrid, step.node, "path");
      });

      progressRef.current.path += 1;
      setStepDescription(`Tracing the final path through (${step.node.row + 1}, ${step.node.col + 1})`);
      setStats((current) => ({
        ...current,
        pathLength: progressRef.current.path,
      }));
    }
  }, [setGrid]);

  const executeStepAt = useCallback((index) => {
    const step = steps[index];

    if (!step) {
      finalizeRun();
      return;
    }

    applyStep(step);

    const nextIndex = index + 1;
    setStepIndex(nextIndex);

    if (nextIndex >= steps.length) {
      finalizeRun();
    }
  }, [applyStep, finalizeRun, steps]);

  const startVisualization = useCallback(() => {
    const cleanGrid = clearGridStatuses(grid);
    const primaryResult = runAlgorithm(algorithm, cleanGrid, startNode, endNode);
    const alternateResult = comparisonMode
      ? runAlgorithm(getAlternateAlgorithm(algorithm), cleanGrid, startNode, endNode)
      : null;

    finalResultRef.current = primaryResult;
    comparisonResultRef.current = alternateResult
      ? {
          label: alternateResult.label,
          complexity: alternateResult.complexity,
          visitedCount: alternateResult.visitedCount,
          pathLength: alternateResult.pathLength,
          pathCost: alternateResult.pathCost,
          hasPath: alternateResult.hasPath,
        }
      : null;

    progressRef.current = { visited: 0, path: 0 };
    clearCurrentMarker();
    setGrid(cleanGrid);
    setStats({
      label: primaryResult.label,
      complexity: primaryResult.complexity,
      visitedCount: 0,
      pathLength: 0,
      pathCost: 0,
      hasPath: primaryResult.hasPath,
    });

    const visitSteps = primaryResult.visitedInOrder
      .filter((node) => node.row !== startNode.row || node.col !== startNode.col)
      .map((node) => ({ type: "visit", node }));
    const pathSteps = primaryResult.path
      .filter(
        (node) =>
          (node.row !== startNode.row || node.col !== startNode.col) &&
          (node.row !== endNode.row || node.col !== endNode.col)
      )
      .map((node) => ({ type: "path", node }));
    const nextSteps = [...visitSteps, ...pathSteps];

    setSteps(nextSteps);
    setStepIndex(0);
    setPrepared(true);
    setPaused(visualizationMode === "step");
    setAutoRunning(visualizationMode === "auto");
    setStepDescription(
      nextSteps.length
        ? visualizationMode === "step"
          ? "Step mode armed. Use Next Step to walk the frontier."
          : "Launching shortest-path exploration."
        : "No traversal steps were generated for this board."
    );

    if (!nextSteps.length) {
      finalizeRun();
    }
  }, [algorithm, clearCurrentMarker, comparisonMode, endNode, finalizeRun, grid, setGrid, startNode, visualizationMode]);

  const togglePause = useCallback(() => {
    if (!prepared || visualizationMode !== "auto") {
      return;
    }

    setPaused((current) => !current);
    setAutoRunning(true);
  }, [prepared, visualizationMode]);

  const nextStep = useCallback(() => {
    if (!prepared || visualizationMode !== "step") {
      return;
    }

    executeStepAt(stepIndex);
  }, [executeStepAt, prepared, stepIndex, visualizationMode]);

  useEffect(() => {
    if (!prepared || visualizationMode !== "auto" || paused) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      executeStepAt(stepIndex);
    }, Math.max(20, 620 - speed));

    return () => window.clearTimeout(timeout);
  }, [executeStepAt, paused, prepared, speed, stepIndex, visualizationMode]);

  return {
    autoRunning,
    comparisonStats,
    nextStep,
    paused,
    prepared,
    resetVisualization,
    startVisualization,
    stats,
    stepDescription,
    togglePause,
  };
};
