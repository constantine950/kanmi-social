import express from "express";
import {
  createComment,
  getPostComments,
} from "../controllers/commentController.ts";
import authMiddleware from "../middlewares/auth.ts";

const commentRoutes = express.Router();

commentRoutes.post("/:id", authMiddleware, createComment);
commentRoutes.get("/:id", authMiddleware, getPostComments);

export default commentRoutes;
