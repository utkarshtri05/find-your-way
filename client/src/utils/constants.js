export const DEFAULT_ROWS = 18;
export const DEFAULT_COLUMNS = 32;
export const DEFAULT_SPEED = 90;
export const DEFAULT_TOOL = "wall";
export const TOKEN_STORAGE_KEY = "find-your-way-token";

export const DRAW_TOOLS = [
  {
    id: "wall",
    label: "Wall",
    description: "Paint blocking cells that the algorithms must route around.",
  },
  {
    id: "weight",
    label: "Weight",
    description: "Increase traversal cost for Dijkstra. BFS treats these like normal nodes.",
  },
  {
    id: "start",
    label: "Start",
    description: "Move the green source node.",
  },
  {
    id: "end",
    label: "End",
    description: "Move the red destination node.",
  },
  {
    id: "erase",
    label: "Erase",
    description: "Remove walls or weight markers from the grid.",
  },
];

export const ALGORITHMS = [
  {
    id: "dijkstra",
    label: "Dijkstra",
    complexity: "O((V + E) log V)",
    summary: "Weighted shortest path with a min-priority queue.",
  },
  {
    id: "bfs",
    label: "Breadth-First Search",
    complexity: "O(V + E)",
    summary: "Unweighted shortest path using a FIFO queue.",
  },
];

export const NODE_LEGEND = [
  { label: "Start", tone: "start" },
  { label: "Goal", tone: "end" },
  { label: "Wall", tone: "wall" },
  { label: "Weight", tone: "weight" },
  { label: "Visited", tone: "visited" },
  { label: "Path", tone: "path" },
];

