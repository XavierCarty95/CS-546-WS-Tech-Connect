import express from "express";
import * as jobHandlers from "./job.handlers.js";




const router = express.Router();

router.post("/", jobHandlers.createJob);
router.post("/apply/:id", jobHandlers.applyJob)
router.get("/", jobHandlers.getJobs);
router.get('/create', jobHandlers.renderJobForm);
router.get("/:id", jobHandlers.getJobById);
router.put("/:id", jobHandlers.updateJob);
router.delete("/:id", jobHandlers.deleteJob);

export default router;
