import User from "../../models/User.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

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

export default getSingleUser;
