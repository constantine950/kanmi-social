import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from "../controllers/messageController.ts";

const messageRoutes = express.Router();

messageRoutes.post(
  "/send",
  authMiddleware,
  upload.single("image"),
  sendMessage
);
messageRoutes.get("/:userId", authMiddleware, getMessages);
messageRoutes.delete("/:id", authMiddleware, deleteMessage);

export default messageRoutes;
