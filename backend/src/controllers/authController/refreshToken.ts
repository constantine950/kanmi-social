import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import { signAccessToken } from "../../utils/token.ts";
import jwt from "jsonwebtoken";

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

export default refreshToken;
