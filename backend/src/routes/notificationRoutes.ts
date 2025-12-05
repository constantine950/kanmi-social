import express from "express";
import authMiddleware from "../middlewares/auth";
import { getNotifications } from "../controllers/notificationController";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-not", authMiddleware, getNotifications);

export default notificationRoutes;
