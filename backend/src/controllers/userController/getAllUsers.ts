import User from "../../models/User.ts";
import catchAsync from "../../utils/catchAsync.ts";

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
