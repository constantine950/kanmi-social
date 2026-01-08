import express from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
} from "../controllers/commentController.ts";
import authMiddleware from "../middlewares/auth.ts";

const commentRoutes = express.Router();

commentRoutes.post("/:id", authMiddleware, createComment);
commentRoutes.get("/:id", authMiddleware, getPostComments);
commentRoutes.delete("/delete/:id", authMiddleware, deleteComment);

export default commentRoutes;
