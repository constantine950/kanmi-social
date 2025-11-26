import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import {
  getSingleUser,
  updatePassword,
  updateUsername,
} from "../controllers/userController.ts";

const userRoutes = express.Router();

userRoutes.get("/me", authMiddleware, getSingleUser);
userRoutes.patch("/update-username", authMiddleware, updateUsername);
userRoutes.patch("/update-password", authMiddleware, updatePassword);

export default userRoutes;
