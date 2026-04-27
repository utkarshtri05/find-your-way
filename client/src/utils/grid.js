import { DEFAULT_COLUMNS, DEFAULT_ROWS } from "./constants";
import { clamp } from "./format";

export const getDefaultEndpoints = (rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS) => ({
  startNode: {
    row: Math.max(1, Math.floor(rows / 2) - 1),
    col: 4,
  },
  endNode: {
    row: Math.max(1, Math.floor(rows / 2) - 1),
    col: Math.max(5, columns - 5),
  },
});

export const createNode = (row, col, startNode, endNode) => {
  const isStart = startNode.row === row && startNode.col === col;
  const isEnd = endNode.row === row && endNode.col === col;

  return {
    row,
    col,
    kind: isStart ? "start" : isEnd ? "end" : "empty",
    weight: isStart || isEnd ? 1 : 1,
    status: "idle",
  };
};

export const createGrid = (rows, columns, startNode, endNode) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, col) => createNode(row, col, startNode, endNode))
  );

export const copyGrid = (grid) => grid.map((row) => row.slice());

export const updateSingleCell = (grid, row, col, updater) => {
  if (!grid[row]?.[col]) {
    return grid;
  }

  const nextGrid = copyGrid(grid);
  nextGrid[row][col] = updater(nextGrid[row][col]);
  return nextGrid;
};

export const clearGridStatuses = (grid) => {
  let nextGrid = grid;

  grid.forEach((row, rowIndex) => {
    row.forEach((node, colIndex) => {
      if (node.status !== "idle") {
        nextGrid = updateSingleCell(nextGrid, rowIndex, colIndex, (currentNode) => ({
          ...currentNode,
          status: "idle",
        }));
      }
    });
  });

  return nextGrid;
};

const makeNode = (node, patch) => ({
  ...node,
  ...patch,
  status: "idle",
});

export const applyToolToGrid = (grid, row, col, tool, startNode, endNode) => {
  const target = grid[row]?.[col];

  if (!target) {
    return { grid, startNode, endNode };
  }

  if (tool === "start") {
    if (target.kind === "end") {
      return { grid, startNode, endNode };
    }

    let nextGrid = updateSingleCell(grid, startNode.row, startNode.col, (node) => makeNode(node, { kind: "empty", weight: 1 }));
    nextGrid = updateSingleCell(nextGrid, row, col, (node) => makeNode(node, { kind: "start", weight: 1 }));

    return {
      grid: nextGrid,
      startNode: { row, col },
      endNode,
    };
  }

  if (tool === "end") {
    if (target.kind === "start") {
      return { grid, startNode, endNode };
    }

    let nextGrid = updateSingleCell(grid, endNode.row, endNode.col, (node) => makeNode(node, { kind: "empty", weight: 1 }));
    nextGrid = updateSingleCell(nextGrid, row, col, (node) => makeNode(node, { kind: "end", weight: 1 }));

    return {
      grid: nextGrid,
      startNode,
      endNode: { row, col },
    };
  }

  if (target.kind === "start" || target.kind === "end") {
    return { grid, startNode, endNode };
  }

  if (tool === "wall") {
    return {
      grid: updateSingleCell(grid, row, col, (node) =>
        makeNode(node, {
          kind: node.kind === "wall" ? "empty" : "wall",
          weight: 1,
        })
      ),
      startNode,
      endNode,
    };
  }

  if (tool === "weight") {
    return {
      grid: updateSingleCell(grid, row, col, (node) =>
        makeNode(node, {
          kind: node.kind === "weight" ? "empty" : "weight",
          weight: node.kind === "weight" ? 1 : 7,
        })
      ),
      startNode,
      endNode,
    };
  }

  if (tool === "erase") {
    return {
      grid: updateSingleCell(grid, row, col, (node) => makeNode(node, { kind: "empty", weight: 1 })),
      startNode,
      endNode,
    };
  }

  return { grid, startNode, endNode };
};

export const buildGridFromLayout = (layout) => {
  const startNode = layout.startNode;
  const endNode = layout.endNode;
  let grid = createGrid(layout.rows, layout.columns, startNode, endNode);

  (layout.walls || []).forEach((wall) => {
    grid = updateSingleCell(grid, wall.row, wall.col, (node) => makeNode(node, { kind: "wall", weight: 1 }));
  });

  (layout.weightedNodes || []).forEach((weightedNode) => {
    grid = updateSingleCell(grid, weightedNode.row, weightedNode.col, (node) =>
      makeNode(node, { kind: "weight", weight: weightedNode.weight || 7 })
    );
  });

  grid = updateSingleCell(grid, startNode.row, startNode.col, (node) => makeNode(node, { kind: "start", weight: 1 }));
  grid = updateSingleCell(grid, endNode.row, endNode.col, (node) => makeNode(node, { kind: "end", weight: 1 }));

  return {
    grid,
    startNode,
    endNode,
  };
};

export const serializeGridState = ({
  name,
  grid,
  rows,
  columns,
  startNode,
  endNode,
  algorithm,
  comparisonMode,
  visualizationMode,
  speed,
}) => {
  const walls = [];
  const weightedNodes = [];

  grid.forEach((row) => {
    row.forEach((node) => {
      if (node.kind === "wall") {
        walls.push({ row: node.row, col: node.col });
      }

      if (node.kind === "weight") {
        weightedNodes.push({ row: node.row, col: node.col, weight: node.weight || 7 });
      }
    });
  });

  return {
    name: name?.trim() || "Untitled Path Lab",
    rows,
    columns,
    startNode,
    endNode,
    walls,
    weightedNodes,
    algorithm,
    comparisonMode,
    visualizationMode,
    speed,
  };
};

export const resizeGridDimensions = (rows, columns) => {
  const nextRows = clamp(Number(rows) || DEFAULT_ROWS, 8, 28);
  const nextColumns = clamp(Number(columns) || DEFAULT_COLUMNS, 10, 42);
  const endpoints = getDefaultEndpoints(nextRows, nextColumns);

  return {
    rows: nextRows,
    columns: nextColumns,
    ...endpoints,
    grid: createGrid(nextRows, nextColumns, endpoints.startNode, endpoints.endNode),
  };
};

export const setNodeStatus = (grid, node, status) =>
  updateSingleCell(grid, node.row, node.col, (currentNode) => ({
    ...currentNode,
    status,
  }));

