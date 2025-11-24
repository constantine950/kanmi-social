import express from "express";
import { loginUser, registerUser } from "../controllers/authController.ts";
import upload from "../middlewares/upload.ts";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("image"), registerUser);
authRoutes.post("/login", loginUser);

export default authRoutes;
