import Notification from "../../models/Notification.ts";
import catchAsync from "../../utils/catchAsync.ts";

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

export default markAllAsRead;
