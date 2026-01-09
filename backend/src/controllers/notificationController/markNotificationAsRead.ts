import Notification from "../../models/Notification.ts";
import catchAsync from "../../utils/catchAsync.ts";

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

export default markNotificationAsRead;
