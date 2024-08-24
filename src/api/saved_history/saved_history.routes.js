import express from "express";
import * as savedHistory from "./saved_history.handlers.js";

const router = express.Router();

router.post("/", savedHistory.createSavedHistory);

router.get("/", savedHistory.getAllSavedHistories);

export default router;
