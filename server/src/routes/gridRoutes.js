import express from "express";

import {
  activateGrid,
  createGrid,
  deleteGrid,
  getGridById,
  getLastGrid,
  listGrids,
  updateGrid,
} from "../controllers/gridController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listGrids);
router.get("/last", getLastGrid);
router.get("/:id", getGridById);
router.post("/", createGrid);
router.put("/:id", updateGrid);
router.post("/:id/activate", activateGrid);
router.delete("/:id", deleteGrid);

export default router;

