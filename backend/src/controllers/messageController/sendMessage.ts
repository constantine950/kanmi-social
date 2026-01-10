import Message from "../../models/Message.ts";
import { getIO, onlineUsers } from "../../socket.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper.ts";

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

  // SOCKET — notify receiver
  const receiverSocketId = onlineUsers.get(receiver.toString());
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message:receive", populatedMessage);
    io.to(receiverSocketId).emit("toast:feedback", {
      message: `${
        (populatedMessage?.sender as any).username
      } sent you a message`,
    });
  }

  // SOCKET — notify sender (for sync)
  const senderSocketId = onlineUsers.get(sender!);
  if (senderSocketId) {
    io.to(senderSocketId).emit("message:sent", populatedMessage);
  }

  res.status(201).json({
    success: true,
    data: populatedMessage,
  });
});

export default sendMessage;
