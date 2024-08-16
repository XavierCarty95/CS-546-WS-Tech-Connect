import express from "express";
import * as jobHandlers from "./job.handlers.js";




const router = express.Router();

router.post("/", jobHandlers.createJob);
router.get("/", jobHandlers.getJobs);
router.get("/:id", jobHandlers.getJobById);
router.put("/:id", jobHandlers.updateJob);
router.delete("/:id", jobHandlers.deleteJob);

export default router;
