import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ControlPanel from "../components/ControlPanel";
import GridBoard from "../components/GridBoard";
import Navbar from "../components/Navbar";
import StatsPanel from "../components/StatsPanel";
import { useAuth } from "../hooks/useAuth";
import { useGridDesigner } from "../hooks/useGridDesigner";
import { usePathfinding } from "../hooks/usePathfinding";
import { activateGrid, getLastGrid, saveGrid, updateGrid } from "../services/api";
import { DEFAULT_SPEED } from "../utils/constants";
import { serializeGridState } from "../utils/grid";

const VisualizerPage = ({ theme, onToggleTheme }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingLayout = location.state?.layout ?? null;

  const {
    rows,
    columns,
    startNode,
    endNode,
    grid,
    setGrid,
    activeTool,
    setActiveTool,
    layoutName,
    setLayoutName,
    layoutId,
    setLayoutId,
    applyTool,
    resetBoard,
    resizeBoard,
    loadLayout,
  } = useGridDesigner();

  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState("auto");
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [drawing, setDrawing] = useState(false);
  const [pageMessage, setPageMessage] = useState("Build your grid and launch a new routing run.");
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
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
  } = usePathfinding({
    algorithm,
    comparisonMode,
    endNode,
    grid,
    setGrid,
    speed,
    startNode,
    visualizationMode,
  });

  const isInteractionLocked = autoRunning || prepared;

  useEffect(() => {
    let cancelled = false;

    const syncIncomingLayout = async () => {
      try {
        if (incomingLayout) {
          resetVisualization({ preserveGrid: true });
          loadLayout(incomingLayout);
          setAlgorithm(incomingLayout.algorithm || "dijkstra");
          setComparisonMode(Boolean(incomingLayout.comparisonMode));
          setVisualizationMode(incomingLayout.visualizationMode || "auto");
          setSpeed(incomingLayout.speed || DEFAULT_SPEED);
          setPageMessage(`Loaded "${incomingLayout.name}" from your dashboard.`);

          if (incomingLayout.id) {
            await activateGrid(incomingLayout.id);
          }
        } else {
          const response = await getLastGrid();

          if (cancelled) {
            return;
          }

          if (response.grid) {
            resetVisualization({ preserveGrid: true });
            loadLayout(response.grid);
            setAlgorithm(response.grid.algorithm || "dijkstra");
            setComparisonMode(Boolean(response.grid.comparisonMode));
            setVisualizationMode(response.grid.visualizationMode || "auto");
            setSpeed(response.grid.speed || DEFAULT_SPEED);
            setPageMessage(`Restored your last session: "${response.grid.name}".`);
          }
        }
      } catch {
        if (!cancelled) {
          setPageMessage("Starting with a fresh board. You can still save as soon as you're ready.");
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    void syncIncomingLayout();

    return () => {
      cancelled = true;
    };
  }, [incomingLayout, loadLayout, location.key, resetVisualization]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleBoardEdit = (row, col) => {
    if (isInteractionLocked) {
      return;
    }

    resetVisualization({ preserveGrid: true });
    applyTool(row, col, activeTool);
  };

  const handlePointerDown = (row, col) => {
    setDrawing(true);
    handleBoardEdit(row, col);
  };

  const handlePointerEnter = (row, col) => {
    if (!drawing || activeTool === "start" || activeTool === "end") {
      return;
    }

    handleBoardEdit(row, col);
  };

  const handleInteractionEnd = () => {
    setDrawing(false);
  };

  const handlePrimaryAction = () => {
    if (visualizationMode === "auto") {
      if (!prepared) {
        startVisualization();
        return;
      }

      togglePause();
      return;
    }

    if (!prepared) {
      startVisualization();
    }
  };

  const handleResetBoard = () => {
    resetVisualization({ preserveGrid: true });
    resetBoard();
    setPageMessage("Board reset to a clean workspace.");
  };

  const handleResetPath = () => {
    resetVisualization();
    setPageMessage("Path animation cleared. Layout remains intact.");
  };

  const handleRowsChange = (nextRows) => {
    resetVisualization({ preserveGrid: true });
    resizeBoard(nextRows, columns);
    setPageMessage(`Grid resized to ${nextRows} rows.`);
  };

  const handleColumnsChange = (nextColumns) => {
    resetVisualization({ preserveGrid: true });
    resizeBoard(rows, nextColumns);
    setPageMessage(`Grid resized to ${nextColumns} columns.`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = serializeGridState({
        name: layoutName,
        grid,
        rows,
        columns,
        startNode,
        endNode,
        algorithm,
        comparisonMode,
        visualizationMode,
        speed,
      });

      const response = layoutId ? await updateGrid(layoutId, payload) : await saveGrid(payload);
      setLayoutId(response.grid.id);
      setLayoutName(response.grid.name);
      setPageMessage(`Saved "${response.grid.name}" to your dashboard.`);
    } catch (error) {
      setPageMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const payload = serializeGridState({
      name: layoutName,
      grid,
      rows,
      columns,
      startNode,
      endNode,
      algorithm,
      comparisonMode,
      visualizationMode,
      speed,
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${payload.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setPageMessage(`Exported "${payload.name}" as JSON.`);
  };

  const gridSummary = grid.reduce(
    (summary, row) => {
      row.forEach((node) => {
        if (node.kind === "wall") {
          summary.walls += 1;
        }

        if (node.kind === "weight") {
          summary.weights += 1;
        }
      });

      return summary;
    },
    { rows, columns, walls: 0, weights: 0 }
  );

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark" onPointerUp={handleInteractionEnd}>
      <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-white/70 px-5 py-4 text-sm text-[var(--text-primary)] shadow-soft backdrop-blur-xl dark:bg-slate-900/60">
          <span className="font-semibold">Workspace status:</span> {saving ? "Saving grid..." : pageMessage}
        </div>

        {initializing ? (
          <div className="panel-surface flex min-h-[400px] items-center justify-center gap-3 text-[var(--text-secondary)]">
            <LoaderCircle size={18} className="animate-spin" />
            Preparing your visualizer...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[320px,1fr,320px]">
            <ControlPanel
              algorithm={algorithm}
              comparisonMode={comparisonMode}
              layoutName={layoutName}
              onAlgorithmChange={(value) => {
                resetVisualization();
                setAlgorithm(value);
              }}
              onComparisonModeChange={(value) => {
                resetVisualization();
                setComparisonMode(value);
              }}
              onColumnsChange={handleColumnsChange}
              onExport={handleExport}
              onLayoutNameChange={setLayoutName}
              onPrimaryAction={handlePrimaryAction}
              onResetBoard={handleResetBoard}
              onResetPath={handleResetPath}
              onRowsChange={handleRowsChange}
              onSave={handleSave}
              onSpeedChange={setSpeed}
              onStep={nextStep}
              onToolChange={(tool) => {
                resetVisualization();
                setActiveTool(tool);
              }}
              onVisualizationModeChange={(mode) => {
                resetVisualization();
                setVisualizationMode(mode);
              }}
              paused={paused}
              prepared={prepared}
              rows={rows}
              columns={columns}
              speed={speed}
              visualizationMode={visualizationMode}
              activeTool={activeTool}
            />

            <GridBoard
              activeTool={activeTool}
              grid={grid}
              isInteractionLocked={isInteractionLocked}
              onCellPointerDown={handlePointerDown}
              onCellPointerEnter={handlePointerEnter}
              onInteractionEnd={handleInteractionEnd}
              stepDescription={stepDescription}
            />

            <StatsPanel comparisonStats={comparisonStats} gridSummary={gridSummary} stats={stats} stepDescription={stepDescription} />
          </div>
        )}
      </main>
    </div>
  );
};

export default VisualizerPage;
