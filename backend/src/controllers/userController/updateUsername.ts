import User from "../../models/User.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";

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

export default updateUsername;
