import cloudinary from "../config/cloudinary.ts";
import User from "../models/User.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import bcrypt from "bcryptjs";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";

const getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const singleUser = await User.findById(userId);
  if (!singleUser) {
    return next(new AppError("User not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "User fetched",
    data: singleUser,
  });
});

const updateUsername = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const userId = req.userInfo?.user_id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("No user found with this username", 404));
  }

  res.status(200).json({
    success: true,
    message: "Username updated",
    data: updatedUser,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { password: oldPassword, newPassword } = req.body;
  const userId = req.userInfo?.user_id;

  if (!oldPassword || !newPassword) {
    return next(new AppError("Old and new password required", 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  const isPassword = await bcrypt.compare(oldPassword, user.password!);

  if (!isPassword) {
    return next(new AppError("old or new password", 400));
  }

  const salt = await bcrypt.genSalt();
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = newHashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed",
  });
});

const updateProfilePicture = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  if (!req.file) {
    return next(new AppError("File required", 400));
  }

  // Fetch user
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.profilePicture?.publicId) {
    await cloudinary.uploader.destroy(user.profilePicture.publicId);
  }

  const uploaded = await uploadBufferToCloudinary(req.file.buffer);
  if (!uploaded) {
    return next(new AppError("Unable to upload to Cloudinary", 500));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile picture updated",
    data: updatedUser?.profilePicture,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.profilePicture?.publicId) {
    await cloudinary.uploader.destroy(user.profilePicture.publicId);
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});

export {
  getSingleUser,
  updateUsername,
  updatePassword,
  updateProfilePicture,
  deleteUser,
};
