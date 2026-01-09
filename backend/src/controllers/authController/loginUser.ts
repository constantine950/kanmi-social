import User from "../../models/User.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../../utils/token.ts";

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

export default loginUser;
