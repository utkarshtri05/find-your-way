import mongoose from "mongoose";

import { GridLayout } from "../models/GridLayout.js";

const isCoordinateWithinBounds = (node, rows, columns) =>
  Number.isInteger(node?.row) &&
  Number.isInteger(node?.col) &&
  node.row >= 0 &&
  node.col >= 0 &&
  node.row < rows &&
  node.col < columns;

const normalizeCoordinate = (node) => ({
  row: Number(node.row),
  col: Number(node.col),
});

const normalizeLayoutPayload = (payload) => {
  const rows = Number(payload.rows);
  const columns = Number(payload.columns);
  const startNode = normalizeCoordinate(payload.startNode || {});
  const endNode = normalizeCoordinate(payload.endNode || {});
  const walls = Array.isArray(payload.walls) ? payload.walls.map(normalizeCoordinate) : [];
  const weightedNodes = Array.isArray(payload.weightedNodes)
    ? payload.weightedNodes.map((node) => ({
        row: Number(node.row),
        col: Number(node.col),
        weight: Number(node.weight) || 7,
      }))
    : [];

  if (!payload.name?.trim()) {
    throw new Error("Layout name is required");
  }

  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 6 || columns < 6) {
    throw new Error("Grid dimensions are invalid");
  }

  if (!isCoordinateWithinBounds(startNode, rows, columns) || !isCoordinateWithinBounds(endNode, rows, columns)) {
    throw new Error("Start and end nodes must stay within the grid bounds");
  }

  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    throw new Error("Start and end nodes must be different");
  }

  const hasInvalidWall = walls.some((wall) => !isCoordinateWithinBounds(wall, rows, columns));
  const hasInvalidWeight = weightedNodes.some((node) => !isCoordinateWithinBounds(node, rows, columns));

  if (hasInvalidWall || hasInvalidWeight) {
    throw new Error("Some saved nodes fall outside the grid bounds");
  }

  return {
    name: payload.name.trim(),
    rows,
    columns,
    startNode,
    endNode,
    walls,
    weightedNodes,
    algorithm: payload.algorithm === "bfs" ? "bfs" : "dijkstra",
    comparisonMode: Boolean(payload.comparisonMode),
    visualizationMode: payload.visualizationMode === "step" ? "step" : "auto",
    speed: Math.min(600, Math.max(20, Number(payload.speed) || 90)),
    lastUsedAt: new Date(),
  };
};

const serializeLayout = (layout) => ({
  id: String(layout._id),
  name: layout.name,
  rows: layout.rows,
  columns: layout.columns,
  startNode: layout.startNode,
  endNode: layout.endNode,
  walls: layout.walls,
  weightedNodes: layout.weightedNodes,
  algorithm: layout.algorithm,
  comparisonMode: layout.comparisonMode,
  visualizationMode: layout.visualizationMode,
  speed: layout.speed,
  lastUsedAt: layout.lastUsedAt,
  updatedAt: layout.updatedAt,
  createdAt: layout.createdAt,
});

export const listGrids = async (req, res, next) => {
  try {
    const layouts = await GridLayout.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({ grids: layouts.map(serializeLayout) });
  } catch (error) {
    return next(error);
  }
};

export const getLastGrid = async (req, res, next) => {
  try {
    const layout = await GridLayout.findOne({ user: req.user._id }).sort({ lastUsedAt: -1, updatedAt: -1 });
    return res.status(200).json({ grid: layout ? serializeLayout(layout) : null });
  } catch (error) {
    return next(error);
  }
};

export const getGridById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid grid id");
    }

    const layout = await GridLayout.findOne({ _id: id, user: req.user._id });

    if (!layout) {
      res.status(404);
      throw new Error("Grid not found");
    }

    layout.lastUsedAt = new Date();
    await layout.save();

    return res.status(200).json({ grid: serializeLayout(layout) });
  } catch (error) {
    return next(error);
  }
};

export const createGrid = async (req, res, next) => {
  try {
    const normalizedPayload = normalizeLayoutPayload(req.body);

    const layout = await GridLayout.create({
      user: req.user._id,
      ...normalizedPayload,
    });

    return res.status(201).json({ grid: serializeLayout(layout) });
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(400);
    }
    return next(error);
  }
};

export const updateGrid = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid grid id");
    }

    const layout = await GridLayout.findOne({ _id: id, user: req.user._id });

    if (!layout) {
      res.status(404);
      throw new Error("Grid not found");
    }

    Object.assign(layout, normalizeLayoutPayload(req.body));
    await layout.save();

    return res.status(200).json({ grid: serializeLayout(layout) });
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(400);
    }
    return next(error);
  }
};

export const activateGrid = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid grid id");
    }

    const layout = await GridLayout.findOne({ _id: id, user: req.user._id });

    if (!layout) {
      res.status(404);
      throw new Error("Grid not found");
    }

    layout.lastUsedAt = new Date();
    await layout.save();

    return res.status(200).json({ grid: serializeLayout(layout) });
  } catch (error) {
    return next(error);
  }
};

export const deleteGrid = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid grid id");
    }

    const layout = await GridLayout.findOneAndDelete({ _id: id, user: req.user._id });

    if (!layout) {
      res.status(404);
      throw new Error("Grid not found");
    }

    return res.status(200).json({ message: "Grid deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
