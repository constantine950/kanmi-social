import express from "express";
import {
  createComment,
  getPostComments,
} from "../controllers/commentController.ts";
import authMiddleware from "../middlewares/auth.ts";

const commentRoutes = express.Router();

commentRoutes.post("/:id/comment", authMiddleware, createComment);
commentRoutes.get("/:id/post-comments", getPostComments);

export default commentRoutes;
