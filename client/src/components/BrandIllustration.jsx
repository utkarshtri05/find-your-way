import { motion } from "framer-motion";

const floatingCardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 * index,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const BrandIllustration = () => (
  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-500 via-sky-500 to-slate-950 px-8 py-10 text-white shadow-soft">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_34%)]" />
    <div className="relative z-10 space-y-6">
      <div className="space-y-3">
        <span className="eyebrow border-white/20 bg-white/10 text-white">Shortest Path Lab</span>
        <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
          Build, test, and save routing strategies in a living grid.
        </h2>
        <p className="max-w-xl text-sm text-white/80 md:text-base">
          Find Your Way blends interactive algorithm education with a polished authenticated workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Dijkstra", "Weighted pathfinding with a min-heap frontier."],
          ["BFS", "Fast unweighted comparison for shortest hops."],
          ["Saved Labs", "Keep your favorite obstacle layouts per account."],
        ].map(([title, description], index) => (
          <motion.div
            key={title}
            custom={index + 1}
            initial="hidden"
            animate="visible"
            variants={floatingCardVariants}
            className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
          >
            <p className="font-display text-lg font-semibold">{title}</p>
            <p className="mt-2 text-sm text-white/75">{description}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/20 p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr,0.9fr]">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.24em] text-white/60">Route Preview</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Live Nodes</span>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 48 }, (_, index) => {
                const tone =
                  index === 8
                    ? "bg-emerald-400"
                    : index === 38
                      ? "bg-rose-400"
                      : [12, 13, 14, 22, 30].includes(index)
                        ? "bg-slate-900/80"
                        : [17, 18, 26].includes(index)
                          ? "bg-amber-300"
                          : [9, 10, 11, 19, 27, 35].includes(index)
                            ? "bg-sky-300"
                            : "bg-white/15";

                return <div key={index} className={`aspect-square rounded-xl ${tone}`} />;
              })}
            </div>
          </div>
          <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Best Path</p>
              <p className="mt-2 font-display text-3xl font-bold">17 hops</p>
              <p className="mt-1 text-sm text-white/75">Animated node expansion with adjustable speed.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Workspace</p>
              <p className="mt-2 text-sm text-white/75">
                Protected dashboard, reusable layouts, and responsive controls built for production use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BrandIllustration;

