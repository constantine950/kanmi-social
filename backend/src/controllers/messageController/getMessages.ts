import Message from "../../models/Message.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";

const getMessages = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;
  const otherUserId = req.params.userId;

  if (!otherUserId) {
    return next(new AppError("User ID required", 400));
  }

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  })
    .populate("sender", "username profilePicture")
    .populate("receiver", "username profilePicture")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});

export default getMessages;
