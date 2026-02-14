import express from "express";
import {
  createHistory,
  getHistory,
  updateHistory,
  deleteHistory,
} from "../controllers/codeHistoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getHistory);
router.post("/", createHistory);
router.put("/:id", updateHistory);
router.delete("/:id", deleteHistory);

export default router;
