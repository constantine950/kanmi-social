import User from "../../models/User.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import bcrypt from "bcryptjs";

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
    return next(new AppError("Wrong password", 400));
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

export default updatePassword;
