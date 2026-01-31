import express from "express";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import createPost from "../controllers/postController/createPost.js";
import getAllPosts from "../controllers/postController/getAllPosts.js";
import getPostsByUser from "../controllers/postController/getPostsByUser.js";
import deletePost from "../controllers/postController/deletePost.js";
import updatePost from "../controllers/postController/updatePost.js";
import togglePostLike from "../controllers/postController/togglePostLike.js";
import getTrendingPosts from "../controllers/postController/getTrendingPosts.js";

const postRoutes = express.Router();

postRoutes.post(
  "/create-post",
  authMiddleware,
  upload.single("image"),
  createPost,
);
postRoutes.get("/get-posts", authMiddleware, getAllPosts);
postRoutes.get("/get-user-posts", authMiddleware, getPostsByUser);
postRoutes.delete("/delete-post/:id", authMiddleware, deletePost);
postRoutes.patch(
  "/update-post/:id",
  authMiddleware,
  upload.single("image"),
  updatePost,
);
postRoutes.patch("/:id/like", authMiddleware, togglePostLike);
postRoutes.get("/trending", authMiddleware, getTrendingPosts);

export default postRoutes;
