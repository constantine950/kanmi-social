import express from "express";
import authMiddleware from "../middlewares/auth.js";
import getNotifications from "../controllers/notificationController/getNotifications.js";
import markNotificationAsRead from "../controllers/notificationController/markNotificationAsRead.js";
import markAllAsRead from "../controllers/notificationController/markAllAsRead.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-not", authMiddleware, getNotifications);
notificationRoutes.patch("/read/:id", authMiddleware, markNotificationAsRead);
notificationRoutes.patch("/read-all", authMiddleware, markAllAsRead);

export default notificationRoutes;
