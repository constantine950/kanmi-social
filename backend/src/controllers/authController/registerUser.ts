import User from "../../models/User.ts";
import { CustomProperty } from "../../types.ts";
import AppError from "../../utils/AppError.ts";
import bcrypt from "bcryptjs";
import catchAsync from "../../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper.ts";

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
  });
});

export default registerUser;
