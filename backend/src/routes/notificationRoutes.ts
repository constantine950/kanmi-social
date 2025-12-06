import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import { getNotifications } from "../controllers/notificationController.ts";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-not", authMiddleware, getNotifications);

export default notificationRoutes;
