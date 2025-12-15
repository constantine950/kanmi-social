import jwt from "jsonwebtoken";
import {
  type CustomJwtPayload,
  type UserInfoReq,
  type UserRes,
} from "../types.ts";
import { type NextFunction, type Response } from "express";
import AppError from "../utils/AppError.ts";

const authMiddleware = (
  req: UserInfoReq,
  res: Response<UserRes>,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return next(new AppError("Access denied", 401));
  }

  try {
    const decodeTokenInfo = jwt.verify(
      token,
      process.env.JWT_KEY!
    ) as CustomJwtPayload;
    req.userInfo = {
      user_id: decodeTokenInfo.user_id,
      username: decodeTokenInfo.username,
      profilePicture: {
        url: decodeTokenInfo.profilePicture.url,
        publicId: decodeTokenInfo.profilePicture.publicId,
      },
    };
    next();
  } catch (error) {
    next(new AppError("Please login again", 401));
  }
};

export default authMiddleware;
