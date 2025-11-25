import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import { getSingleUser } from "../controllers/userController.ts";

const userRoutes = express.Router();

userRoutes.get("/me", authMiddleware, getSingleUser);

export default userRoutes;
