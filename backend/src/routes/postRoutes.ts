import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import createPost from "../controllers/postController/createPost.ts";
import getAllPosts from "../controllers/postController/getAllPosts.ts";
import getPostsByUser from "../controllers/postController/getPostsByUser.ts";
import deletePost from "../controllers/postController/deletePost.ts";
import updatePost from "../controllers/postController/updatePost.ts";
import togglePostLike from "../controllers/postController/togglePostLike.ts";
import getTrendingPosts from "../controllers/postController/getTrendingPosts.ts";

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
postRoutes.get("/trending", authMiddleware, getTrendingPosts);

export default postRoutes;
