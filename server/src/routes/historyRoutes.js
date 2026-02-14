import express from "express";
import {
  createHistory,
  getHistory,
  updateHistory,
} from "../controllers/codeHistoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getHistory);
router.post("/", createHistory);
router.put("/:id", updateHistory);

export default router;
