import Message from "../models/Message.ts";
import User from "../models/User.ts";
import { getIO, onlineUsers } from "../socket.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";

const sendMessage = catchAsync(async (req, res, next) => {
  const { text, receiver } = req.body;
  const sender = req.userInfo?.user_id;
  const io = getIO();

  if (!receiver || (!text && !req.file)) {
    return next(new AppError("Message content required", 400));
  }

  let imageData = null;

  if (req.file) {
    const upload = await uploadBufferToCloudinary(req.file.buffer);
    if (!upload) return next(new AppError("Failed to upload image", 500));

    imageData = {
      url: upload.secure_url,
      publicId: upload.public_id,
    };
  }

  const message = await Message.create({
    sender,
    receiver,
    text,
    image: imageData,
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "username profilePicture")
    .populate("receiver", "username profilePicture");

  // 🔔 SOCKET — notify receiver
  const receiverSocketId = onlineUsers.get(receiver.toString());
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message:receive", populatedMessage);
    io.to(receiverSocketId).emit("toast:feedback", {
      message: `${
        (populatedMessage?.sender as any).username
      } sent you a message`,
    });
  }

  // 🔔 SOCKET — notify sender (for sync)
  const senderSocketId = onlineUsers.get(sender!);
  if (senderSocketId) {
    io.to(senderSocketId).emit("message:sent", populatedMessage);
  }

  res.status(201).json({
    success: true,
    data: populatedMessage,
  });
});

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

export { sendMessage, getMessages, deleteMessage };
