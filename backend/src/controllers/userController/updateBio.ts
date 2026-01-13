import User from "../../models/User.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

const updateBio = catchAsync(async (req, res, next) => {
  const { bio } = req.body;
  const userId = req.userInfo?.user_id;

  const updatedUserBio = await User.findByIdAndUpdate(
    userId,
    { bio },
    { new: true, runValidators: true }
  );

  if (!updatedUserBio) {
    return next(new AppError("Not able to update bio", 404));
  }

  res.status(200).json({
    success: true,
    data: updatedUserBio,
  });
});

export default updateBio;
