import Message from "../../models/Message.ts";
import { getIO, onlineUsers } from "../../socket.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";

const deleteMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.id;
  const userId = req.userInfo?.user_id;
  const io = getIO();

  const message = await Message.findById(messageId);
  if (!message) return next(new AppError("Message not found", 404));

  if (message.sender.toString() !== userId) {
    return next(new AppError("Not authorized", 403));
  }

  await message.deleteOne();

  const receiverSocketId = onlineUsers.get(message.receiver.toString());
  const senderSocketId = onlineUsers.get(userId!);

  const payload = { messageId };

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message:deleted", payload);
  }

  if (senderSocketId) {
    io.to(senderSocketId).emit("message:deleted", payload);
    io.to(senderSocketId).emit("toast:feedback", {
      message: "Message deleted",
    });
  }

  res.status(200).json({
    success: true,
  });
});

export default deleteMessage;
