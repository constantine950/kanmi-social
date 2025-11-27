import User from "../models/User.ts";
import { type CustomProperty } from "../types.ts";
import bcrypt from "bcryptjs";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/AppError.ts";
import jwt from "jsonwebtoken";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";

const registerUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!req.file) {
    return next(new AppError("file required", 400));
  }

  const existingUser: CustomProperty | null = await User.findOne({
    username,
  });
  if (existingUser) {
    return res.status(200).json({
      success: true,
      message: "You already registered, please login instead",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const uploaded = await uploadBufferToCloudinary(req.file.buffer);
  if (!uploaded) {
    return next(new AppError("Upload failed. Try again", 500));
  }

  const newlyCreatedUser: CustomProperty = new User({
    username,
    password: hashedpassword,
    profilePicture: {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    },
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
    return next(
      new AppError("incorrect password, Please type correct password", 400)
    );
  }

  const accessToken = jwt.sign(
    {
      user_id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_KEY!,
    { expiresIn: "30m" }
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: accessToken,
  });
});

export { registerUser, loginUser };
