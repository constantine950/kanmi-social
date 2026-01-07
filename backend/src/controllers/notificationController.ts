import Notification from "../models/Notification.ts";
import catchAsync from "../utils/catchAsync.ts";

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

const markNotificationAsRead = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;
  const { id } = req.params;

  const notif = await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { read: true },
    { new: true }
  );

  if (!notif)
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });

  res.status(200).json({ success: true, data: notif });
});

const markAllAsRead = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  await Notification.updateMany(
    { recipient: userId, read: false },
    { read: true }
  );

  res
    .status(200)
    .json({ success: true, message: "All notifications marked as read" });
});

export { getNotifications, markNotificationAsRead, markAllAsRead };
