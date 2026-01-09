import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import getNotifications from "../controllers/notificationController/getNotifications.ts";
import markNotificationAsRead from "../controllers/notificationController/markNotificationAsRead.ts";
import markAllAsRead from "../controllers/notificationController/markAllAsRead.ts";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-not", authMiddleware, getNotifications);
notificationRoutes.patch("/read/:id", authMiddleware, markNotificationAsRead);
notificationRoutes.patch("/read-all", authMiddleware, markAllAsRead);

export default notificationRoutes;
