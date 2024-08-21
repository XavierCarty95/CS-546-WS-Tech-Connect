// routes/userRoutes.js
import express from "express";
import * as userHandlers from "./user.handlers.js";

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

router.post("/register", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.createUser);

router.post("/login", userHandlers.authenticateUser);

router.get("/", userHandlers.getUsers);

router.get("/:id", userHandlers.getUserById);
router.put("/:id", userHandlers.updateUser);
router.delete("/:id", userHandlers.deleteUser);

export default router;



