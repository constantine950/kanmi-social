import User from "../models/User.ts";
import { type CustomProperty } from "../types.ts";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.ts";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/AppError.ts";

const registerUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!req.file) {
    return next(new AppError("file required", 400));
  }

  const existingUser: CustomProperty | null = await User.findOne({
    username,
  });
  if (existingUser) {
    return next(new AppError("You already registered", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const uploaded = await uploadToCloudinary(req.file.path);
  if (!uploaded) {
    return next(new AppError("Upload failed. Try again", 500));
  }
  const { url, publicId } = uploaded;

  const newlyCreatedUser: CustomProperty = new User({
    username,
    password: hashedpassword,
    profilePicture: {
      url,
      publicId,
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

export { registerUser };
