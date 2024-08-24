// routes/userRoutes.js
import express from "express";
import * as userHandlers from "./user.handlers.js";

import multer from 'multer';
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Absolute path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Avoid conflicts
    }
});

const upload = multer({ storage: storage });


const router = express.Router();

router.post("/register", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.createUser);

router.post("/login", userHandlers.authenticateUser);
router.post("/edit/:id", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.updateProfile);

router.get("/", userHandlers.getUsers);
router.get("/profile", userHandlers.getProfile);
router.get("/edit", userHandlers.editProfile);

router.get("/:id", userHandlers.getUserById);
router.put("/:id", userHandlers.updateUser);
router.delete("/:id", userHandlers.deleteUser);

export default router;



