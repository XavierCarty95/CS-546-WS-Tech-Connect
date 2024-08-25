import express from "express";
import * as jobHandlers from "./job.handlers.js";




const router = express.Router();

router.get("/", jobHandlers.getJobs);
router.post("/", jobHandlers.createJob);

router.post("/apply/:id", jobHandlers.applyJob)
router.get('/create', jobHandlers.renderJobForm);
router.get('/:id/applicants', jobHandlers.getApplicants)

router.get("/:id", jobHandlers.getUpdatedJob);
router.put("/:id", jobHandlers.updateJob);
router.delete("/:id", jobHandlers.deleteJob);


router.post("/like/:id", jobHandlers.likeJob)
router.post("/dislike/:id", jobHandlers.dislikeJob)
router.post('/:id/comment', jobHandlers.addComments)

export default router;
