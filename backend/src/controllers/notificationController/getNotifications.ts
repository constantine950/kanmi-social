import Notification from "../../models/Notification.js";
import catchAsync from "../../utils/catchAsync.js";

const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "username profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

export default getNotifications;
