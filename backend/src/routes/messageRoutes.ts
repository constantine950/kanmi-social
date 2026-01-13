import express from "express";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import sendMessage from "../controllers/messageController/sendMessage.js";
import getMessages from "../controllers/messageController/getMessages.js";
import deleteMessage from "../controllers/messageController/deleteMessage.js";

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
