import express from "express";
import * as profileHandler from "./profileHandlers.js"

import multer from 'multer';

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", profileHandler.renderProfile);
router.get("/edit", profileHandler.editProfile);

router.post("/edit", profileHandler.updateProfile);

export default router;