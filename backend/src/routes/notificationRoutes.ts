import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
} from "../controllers/notificationController.ts";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-not", authMiddleware, getNotifications);
notificationRoutes.patch("/read/:id", authMiddleware, markNotificationAsRead);
notificationRoutes.patch("/read-all", authMiddleware, markAllAsRead);

export default notificationRoutes;
