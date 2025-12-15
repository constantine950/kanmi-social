import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/authController.ts";
import upload from "../middlewares/upload.ts";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("image"), registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
