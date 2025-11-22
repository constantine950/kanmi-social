import express from "express";
import { registerUser } from "../controllers/authController.ts";
import upload from "../middlewares/upload.ts";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("image"), registerUser);

export default authRoutes;
