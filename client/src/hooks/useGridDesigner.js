import { useCallback, useRef, useState } from "react";

import { DEFAULT_COLUMNS, DEFAULT_ROWS, DEFAULT_TOOL } from "../utils/constants";
import {
  applyToolToGrid,
  buildGridFromLayout,
  clearGridStatuses,
  createGrid,
  getDefaultEndpoints,
  resizeGridDimensions,
} from "../utils/grid";

const initialGridState = () => {
  const endpoints = getDefaultEndpoints(DEFAULT_ROWS, DEFAULT_COLUMNS);

  return {
    rows: DEFAULT_ROWS,
    columns: DEFAULT_COLUMNS,
    startNode: endpoints.startNode,
    endNode: endpoints.endNode,
    grid: createGrid(DEFAULT_ROWS, DEFAULT_COLUMNS, endpoints.startNode, endpoints.endNode),
  };
};

export const useGridDesigner = () => {
  const [initialState] = useState(initialGridState);
  const gridRef = useRef(initialState.grid);
  const startNodeRef = useRef(initialState.startNode);
  const endNodeRef = useRef(initialState.endNode);

  const [rows, setRows] = useState(initialState.rows);
  const [columns, setColumns] = useState(initialState.columns);
  const [startNode, setStartNode] = useState(initialState.startNode);
  const [endNode, setEndNode] = useState(initialState.endNode);
  const [grid, setGrid] = useState(initialState.grid);
  const [activeTool, setActiveTool] = useState(DEFAULT_TOOL);
  const [layoutName, setLayoutName] = useState("My Path Studio");
  const [layoutId, setLayoutId] = useState(null);

  const applyTool = useCallback((row, col, tool) => {
    const cleanGrid = clearGridStatuses(gridRef.current);
    const result = applyToolToGrid(cleanGrid, row, col, tool, startNodeRef.current, endNodeRef.current);
    gridRef.current = result.grid;
    startNodeRef.current = result.startNode;
    endNodeRef.current = result.endNode;
    setGrid(result.grid);
    setStartNode(result.startNode);
    setEndNode(result.endNode);
  }, []);

  const resetBoard = useCallback(() => {
    const endpoints = getDefaultEndpoints(rows, columns);
    startNodeRef.current = endpoints.startNode;
    endNodeRef.current = endpoints.endNode;
    gridRef.current = createGrid(rows, columns, endpoints.startNode, endpoints.endNode);
    setStartNode(endpoints.startNode);
    setEndNode(endpoints.endNode);
    setGrid(gridRef.current);
    setLayoutId(null);
    setLayoutName("My Path Studio");
  }, [columns, rows]);

  const resizeBoard = useCallback((nextRows, nextColumns) => {
    const resized = resizeGridDimensions(nextRows, nextColumns);
    gridRef.current = resized.grid;
    startNodeRef.current = resized.startNode;
    endNodeRef.current = resized.endNode;
    setRows(resized.rows);
    setColumns(resized.columns);
    setStartNode(resized.startNode);
    setEndNode(resized.endNode);
    setGrid(resized.grid);
  }, []);

  const loadLayout = useCallback((layout) => {
    const hydrated = buildGridFromLayout(layout);
    gridRef.current = hydrated.grid;
    startNodeRef.current = hydrated.startNode;
    endNodeRef.current = hydrated.endNode;
    setRows(layout.rows);
    setColumns(layout.columns);
    setStartNode(hydrated.startNode);
    setEndNode(hydrated.endNode);
    setGrid(hydrated.grid);
    setLayoutId(layout.id);
    setLayoutName(layout.name);
  }, []);

  return {
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
  };
};
