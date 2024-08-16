// routes/userRoutes.js
import express from "express";
import * as userHandlers from "./user.handlers.js";



const router = express.Router();
router.post("/register", userHandlers.createUser);
router.post("/login", userHandlers.authenticateUser);
router.get("/", userHandlers.getUsers);
router.get("/:id", userHandlers.getUserById);
router.put("/:id", userHandlers.updateUser);
router.delete("/:id", userHandlers.deleteUser);

export default router;



