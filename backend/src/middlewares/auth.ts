import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlacklistedToken.ts";
import {
  type CustomJwtPayload,
  type UserInfoReq,
  type UserRes,
} from "../types.ts";
import { type NextFunction, type Response } from "express";
import AppError from "../utils/AppError.ts";

const authMiddleware = async (
  req: UserInfoReq,
  res: Response<UserRes>,
  next: NextFunction
) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Access token missing", 401));
  }

  const token = authHeader.split(" ")[1];

  // 🔴 1️⃣ Check blacklist
  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return next(new AppError("Access token invalidated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as CustomJwtPayload;

    req.userInfo = {
      user_id: decoded.user_id,
      username: decoded.username,
      profilePicture: decoded.profilePicture,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401));
    }

    return next(new AppError("Invalid access token", 401));
  }
};

export default authMiddleware;
