import { motion } from "framer-motion";
import { ArrowRight, Database, LayoutTemplate, LoaderCircle, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SavedGridCard from "../components/SavedGridCard";
import { useAuth } from "../hooks/useAuth";
import { deleteGrid, getGrids, getLastGrid } from "../services/api";
import { formatDateTime, formatRelativeTime } from "../utils/format";

const fetchDashboardData = () => Promise.all([getGrids(), getLastGrid()]);

const DashboardPage = ({ theme, onToggleTheme }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [grids, setGrids] = useState([]);
  const [lastGrid, setLastGrid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (withRefreshState = false) => {
    try {
      if (withRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [gridsResponse, lastGridResponse] = await fetchDashboardData();
      setGrids(gridsResponse.grids || []);
      setLastGrid(lastGridResponse.grid);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrapDashboard = async () => {
      try {
        const [gridsResponse, lastGridResponse] = await fetchDashboardData();

        if (cancelled) {
          return;
        }

        setGrids(gridsResponse.grids || []);
        setLastGrid(lastGridResponse.grid);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void bootstrapDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const openVisualizer = (layout) => {
    navigate("/visualizer", { state: { layout } });
  };

  const handleDeleteGrid = async (gridId) => {
    try {
      await deleteGrid(gridId);
      const nextGrids = grids.filter((grid) => grid.id !== gridId);
      setGrids(nextGrids);

      if (lastGrid?.id === gridId) {
        setLastGrid(nextGrids[0] || null);
      }
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="panel-surface overflow-hidden p-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="eyebrow">Workspace overview</span>
                  <h1 className="font-display text-4xl font-bold">Welcome back, {user?.fullName?.split(" ")[0]}</h1>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                    Re-open your saved routing labs, compare Dijkstra against BFS, and keep every obstacle map synced to your account.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/visualizer")}
                    className="surface-button gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
                  >
                    <PlayCircle size={16} />
                    Launch Visualizer
                  </button>
                  {lastGrid && (
                    <button
                      type="button"
                      onClick={() => openVisualizer(lastGrid)}
                      className="surface-button gap-2 border-white/10 bg-white/70 text-[var(--text-primary)] dark:bg-slate-900/60"
                    >
                      <ArrowRight size={16} />
                      Continue Last Grid
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => loadDashboard(true)}
                    className="surface-button border-white/10 bg-white/70 text-[var(--text-primary)] dark:bg-slate-900/60"
                  >
                    {refreshing ? "Refreshing..." : "Refresh Data"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/70 p-5 dark:bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Saved projects</p>
                  <p className="mt-3 font-display text-4xl font-bold">{grids.length}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Reusable labs across devices and sessions.</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/70 p-5 dark:bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Last activity</p>
                  <p className="mt-3 text-lg font-semibold">{lastGrid ? formatRelativeTime(lastGrid.lastUsedAt) : "No saved activity yet"}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {lastGrid ? `${lastGrid.name} - ${lastGrid.algorithm}` : "Create a visualizer layout to populate this area."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="panel-surface p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Last used grid</p>
                <h2 className="font-display text-2xl font-bold">Quick resume</h2>
              </div>
              <Database size={20} className="text-emerald-500" />
            </div>

            {lastGrid ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/70 p-5 dark:bg-slate-900/60">
                  <p className="font-display text-2xl font-bold">{lastGrid.name}</p>
                  <p className="mt-2 text-sm capitalize text-[var(--text-secondary)]">
                    {lastGrid.algorithm} - {lastGrid.rows} x {lastGrid.columns}
                  </p>
                  <div className="mt-5 grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Updated</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatDateTime(lastGrid.updatedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Mode</span>
                      <span className="font-medium capitalize text-[var(--text-primary)]">{lastGrid.visualizationMode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Speed</span>
                      <span className="font-medium text-[var(--text-primary)]">{lastGrid.speed}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openVisualizer(lastGrid)}
                  className="surface-button w-full gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
                >
                  <ArrowRight size={16} />
                  Open Last Grid
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.75rem] border border-dashed border-white/20 bg-white/50 p-6 text-sm text-[var(--text-secondary)] dark:bg-slate-900/40">
                Save your first layout from the visualizer to unlock quick resume here.
              </div>
            )}
          </motion.aside>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">Saved layouts</p>
              <h2 className="font-display text-3xl font-bold">Project library</h2>
            </div>
            <LayoutTemplate size={20} className="text-[var(--text-secondary)]" />
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="panel-surface flex items-center justify-center gap-3 px-6 py-12 text-[var(--text-secondary)]">
              <LoaderCircle size={18} className="animate-spin" />
              Loading saved projects...
            </div>
          ) : grids.length ? (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {grids.map((layout) => (
                <SavedGridCard key={layout.id} layout={layout} onOpen={openVisualizer} onDelete={handleDeleteGrid} />
              ))}
            </div>
          ) : (
            <div className="panel-surface px-6 py-12 text-center">
              <p className="font-display text-2xl font-bold">Your project library is empty</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Create a grid in the visualizer, save it, and it will appear here for quick access.
              </p>
              <button
                type="button"
                onClick={() => navigate("/visualizer")}
                className="surface-button mt-6 gap-2 border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
              >
                <PlayCircle size={16} />
                Create First Grid
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
