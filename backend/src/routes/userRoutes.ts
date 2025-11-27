import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import {
  deleteUser,
  getSingleUser,
  updatePassword,
  updateProfilePicture,
  updateUsername,
} from "../controllers/userController.ts";
import upload from "../middlewares/upload.ts";

const userRoutes = express.Router();

userRoutes.get("/me", authMiddleware, getSingleUser);
userRoutes.patch("/update-username", authMiddleware, updateUsername);
userRoutes.patch("/update-password", authMiddleware, updatePassword);
userRoutes.patch(
  "/update-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture
);
userRoutes.delete("/delete-user", authMiddleware, deleteUser);

export default userRoutes;
