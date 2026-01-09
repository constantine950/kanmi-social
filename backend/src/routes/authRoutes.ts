import express from "express";
import upload from "../middlewares/upload.ts";
import registerUser from "../controllers/authController/registerUser.ts";
import loginUser from "../controllers/authController/loginUser.ts";
import refreshToken from "../controllers/authController/refreshToken.ts";
import logoutUser from "../controllers/authController/logoutUser.ts";

const authRoutes = express.Router();

authRoutes.post("/register", upload.single("image"), registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
