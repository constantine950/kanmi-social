import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import { sendMessage } from "../controllers/messageController.ts";

const messageRoutes = express.Router();

messageRoutes.post(
  "/send",
  authMiddleware,
  upload.single("image"),
  sendMessage
);

export default messageRoutes;
