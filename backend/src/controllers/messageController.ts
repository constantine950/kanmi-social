import Message from "../models/Message.ts";
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

    imageData = { url: upload.secure_url, publicId: upload.public_id };
  }

  const message = await Message.create({
    sender,
    receiver,
    text,
    image: imageData,
  });

  // Check if receiver is online
  const receiverSocketId = onlineUsers.get(receiver.toString());

  if (receiverSocketId) {
    // Send message instantly
    io.to(receiverSocketId).emit("message:receive", {
      _id: message._id,
      sender,
      receiver,
      text,
      image: imageData,
      createdAt: message.createdAt,
    });
  }

  res.status(201).json({
    success: true,
    message: "Message sent",
    data: message,
  });
});

export { sendMessage };
