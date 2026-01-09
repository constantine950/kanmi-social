import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import createComment from "../controllers/commentController/createComment.ts";
import getPostComments from "../controllers/commentController/getPostComments.ts";
import deleteComment from "../controllers/commentController/deleteComment.ts";

const commentRoutes = express.Router();

commentRoutes.post("/:id", authMiddleware, createComment);
commentRoutes.get("/:id", authMiddleware, getPostComments);
commentRoutes.delete("/delete/:id", authMiddleware, deleteComment);

export default commentRoutes;
