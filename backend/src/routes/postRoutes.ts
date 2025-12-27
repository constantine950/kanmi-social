import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getTotalLikes,
  getTrendingPosts,
  togglePostLike,
  updatePost,
} from "../controllers/postController.ts";

const postRoutes = express.Router();

postRoutes.post(
  "/create-post",
  authMiddleware,
  upload.single("postPicture"),
  createPost
);
postRoutes.get("/get-posts", authMiddleware, getAllPosts);
postRoutes.get("/get-user-posts", authMiddleware, getPostsByUser);
postRoutes.delete("/delete-post/:id", authMiddleware, deletePost);
postRoutes.patch(
  "/update-post/:id",
  authMiddleware,
  upload.single("postPicture"),
  updatePost
);
postRoutes.patch("/:id/like", authMiddleware, togglePostLike);
postRoutes.get("/:id/likes/count", authMiddleware, getTotalLikes);
postRoutes.get("/trending", authMiddleware, getTrendingPosts);
postRoutes.get("/:id", authMiddleware, getPostById);

export default postRoutes;
