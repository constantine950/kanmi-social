import { type Request, type Response } from "express";
import User from "../models/User.ts";
import {
  type UserInfoReq,
  type CustomProperty,
  type UserRes,
} from "../types.ts";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.ts";

const registerUser = async (req: UserInfoReq, res: Response<UserRes>) => {
  try {
    const { username, password } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file required",
      });
    }
    const existingUser: CustomProperty | null = await User.findOne({
      username,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "You already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const uploaded = await uploadToCloudinary(req.file.path);
    if (!uploaded) throw new Error("Upload failed");
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

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Not able to register",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Register server error, try again",
    });
  }
};

export { registerUser };
