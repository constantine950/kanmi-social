import express from "express";
import authMiddleware from "../middlewares/auth.ts";
import upload from "../middlewares/upload.ts";
import getAllUsers from "../controllers/userController/getAllUsers.ts";
import getSingleUser from "../controllers/userController/getSingleUser.ts";
import updateUsername from "../controllers/userController/updateUsername.ts";
import updateBio from "../controllers/userController/updateBio.ts";
import updatePassword from "../controllers/userController/updatePassword.ts";
import updateProfilePicture from "../controllers/userController/updateProfilePicture.ts";
import deleteUser from "../controllers/userController/deleteUser.ts";

const userRoutes = express.Router();

userRoutes.get("/all-users", authMiddleware, getAllUsers);
userRoutes.get("/me", authMiddleware, getSingleUser);
userRoutes.patch("/update-username", authMiddleware, updateUsername);
userRoutes.patch("/update-bio", authMiddleware, updateBio);
userRoutes.patch("/update-password", authMiddleware, updatePassword);
userRoutes.patch(
  "/update-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture
);
userRoutes.delete("/delete-user", authMiddleware, deleteUser);

export default userRoutes;
