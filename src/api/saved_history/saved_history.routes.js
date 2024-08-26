import express from "express";
import * as savedHistory from "./saved_history.handlers.js";

const router = express.Router();

router.post("/:id", savedHistory.createSavedHistory);

router.get("/", savedHistory.getAllSavedHistories);

router.delete("/:id", savedHistory.deleteSavedPost)


export default router;
