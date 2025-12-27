import User from "../models/User.ts";
import { type CustomProperty } from "../types.ts";
import bcrypt from "bcryptjs";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/AppError.ts";
import jwt from "jsonwebtoken";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";
import { signAccessToken, signRefreshToken } from "../utils/token.ts";
import BlacklistedToken from "../models/BlacklistedToken.ts";

const registerUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  let imageData = null;
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer);
    if (!uploaded) {
      return next(new AppError("Upload failed. Try again", 500));
    }

    imageData = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const existingUser: CustomProperty | null = await User.findOne({
    username,
  });
  if (existingUser) {
    return res.status(409).json({
      success: true,
      message: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const newlyCreatedUser: CustomProperty = new User({
    username,
    password: hashedpassword,
    profilePicture: imageData,
  });
  await newlyCreatedUser.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: newlyCreatedUser._id,
      username: newlyCreatedUser.username,
      profilePicture: newlyCreatedUser.profilePicture,
    },
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError("No user with this username", 400));
  }

  const matchUserPassword = await bcrypt.compare(password, user.password!);
  if (!matchUserPassword) {
    return next(new AppError("Incorrect password", 400));
  }

  const payload = {
    user_id: user._id,
    username: user.username,
    profilePicture: user.profilePicture,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    },
  });
});

const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new AppError("No refresh token", 401));
  }

  jwt.verify(token, process.env.JWT_REFRESH_KEY!, (err: any, decoded: any) => {
    if (err) {
      return next(new AppError("Invalid refresh token", 401));
    }

    const payload = {
      user_id: decoded.user_id,
      username: decoded.username,
      profilePicture: decoded.profilePicture,
    };

    const newAccessToken = signAccessToken(payload);

    res.status(200).json({
      success: true,
      user: payload,
      newAccessToken,
    });
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (decoded?.exp) {
      await BlacklistedToken.create({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export { registerUser, loginUser, refreshToken, logoutUser };
