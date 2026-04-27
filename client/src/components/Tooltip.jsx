const Tooltip = ({ content, children, side = "top" }) => {
  const sideClasses =
    side === "bottom"
      ? "top-full mt-3"
      : side === "left"
        ? "right-full mr-3 top-1/2 -translate-y-1/2"
        : side === "right"
          ? "left-full ml-3 top-1/2 -translate-y-1/2"
          : "bottom-full mb-3";

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={`pointer-events-none absolute left-1/2 z-40 hidden min-w-52 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/92 px-3 py-2 text-xs leading-5 text-slate-100 shadow-2xl group-hover:block ${sideClasses}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;

