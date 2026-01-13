import express from "express";
import authMiddleware from "../middlewares/auth.js";
import createComment from "../controllers/commentController/createComment.js";
import getPostComments from "../controllers/commentController/getPostComments.js";
import deleteComment from "../controllers/commentController/deleteComment.js";

const commentRoutes = express.Router();

commentRoutes.post("/:id", authMiddleware, createComment);
commentRoutes.get("/:id", authMiddleware, getPostComments);
commentRoutes.delete("/delete/:id", authMiddleware, deleteComment);

export default commentRoutes;
