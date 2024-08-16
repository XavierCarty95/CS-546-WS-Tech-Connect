import express from "express";
import {
  createSavedHistory,
  getAllSavedHistories,
} from "./saved_history.handlers.js";

const router = express.Router();

router.post("/", createSavedHistory);

router.get("/", getAllSavedHistories);

export default router;
