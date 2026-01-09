import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import sendMessage from "../controllers/messageController/sendMessage.ts";
import getMessages from "../controllers/messageController/getMessages.ts";
import deleteMessage from "../controllers/messageController/deleteMessage.ts";

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
