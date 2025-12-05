import Notification from "../models/Notification.ts";
import catchAsync from "../utils/catchAsync.ts";

const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "username profilePicture")
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    message: "User notification",
    data: notifications,
  });
});

export { getNotifications };
