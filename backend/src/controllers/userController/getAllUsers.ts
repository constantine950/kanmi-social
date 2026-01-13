import User from "../../models/User.js";
import catchAsync from "../../utils/catchAsync.js";

const getAllUsers = catchAsync(async (req, res) => {
  const userId = req.userInfo?.user_id;

  const users = await User.find(
    { _id: { $ne: userId } },
    "username profilePicture"
  ).sort({ username: 1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

export default getAllUsers;
