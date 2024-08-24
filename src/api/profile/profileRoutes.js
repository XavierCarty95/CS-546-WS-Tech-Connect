import express from "express";
import * as profileHandler from "./profileHandlers.js"


const router = express.Router();


router.get("edit/:id", profileHandler.getProfile)
router.get("/edit", profileHandler.editProfile);

export default router;