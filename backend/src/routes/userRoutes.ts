import express from "express";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import getAllUsers from "../controllers/userController/getAllUsers.js";
import getSingleUser from "../controllers/userController/getSingleUser.js";
import updateUsername from "../controllers/userController/updateUsername.js";
import updateBio from "../controllers/userController/updateBio.js";
import updatePassword from "../controllers/userController/updatePassword.js";
import updateProfilePicture from "../controllers/userController/updateProfilePicture.js";
import deleteUser from "../controllers/userController/deleteUser.js";

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
