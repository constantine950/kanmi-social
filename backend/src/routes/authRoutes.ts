import express from "express";
import upload from "../middlewares/upload.js";
import registerUser from "../controllers/authController/registerUser.js";
import loginUser from "../controllers/authController/loginUser.js";
import refreshToken from "../controllers/authController/refreshToken.js";
import logoutUser from "../controllers/authController/logoutUser.js";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("image"), registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
