import mongoose from "mongoose";

const coordinateSchema = new mongoose.Schema(
  {
    row: {
      type: Number,
      required: true,
      min: 0,
    },
    col: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const weightedNodeSchema = new mongoose.Schema(
  {
    row: {
      type: Number,
      required: true,
      min: 0,
    },
    col: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
      default: 7,
    },
  },
  { _id: false }
);

const gridLayoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Layout name is required"],
      trim: true,
      maxlength: 80,
    },
    rows: {
      type: Number,
      required: true,
      min: 6,
      max: 40,
    },
    columns: {
      type: Number,
      required: true,
      min: 6,
      max: 60,
    },
    startNode: {
      type: coordinateSchema,
      required: true,
    },
    endNode: {
      type: coordinateSchema,
      required: true,
    },
    walls: {
      type: [coordinateSchema],
      default: [],
    },
    weightedNodes: {
      type: [weightedNodeSchema],
      default: [],
    },
    algorithm: {
      type: String,
      enum: ["dijkstra", "bfs"],
      default: "dijkstra",
    },
    comparisonMode: {
      type: Boolean,
      default: false,
    },
    visualizationMode: {
      type: String,
      enum: ["auto", "step"],
      default: "auto",
    },
    speed: {
      type: Number,
      min: 20,
      max: 600,
      default: 90,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GridLayout = mongoose.model("GridLayout", gridLayoutSchema);

