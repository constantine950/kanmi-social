import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import { createPost, getAllPosts } from "../controllers/postController.ts";

const postRoutes = express.Router();

postRoutes.post(
  "/create-post",
  authMiddleware,
  upload.single("postPicture"),
  createPost
);

postRoutes.get("/get-posts", authMiddleware, getAllPosts);
postRoutes.get("/get-user-posts", authMiddleware, getAllPosts);

export default postRoutes;
