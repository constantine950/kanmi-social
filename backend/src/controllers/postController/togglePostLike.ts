import mongoose from "mongoose";
import Notification from "../../models/Notification.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import { getIO, onlineUsers } from "../../socket.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

const togglePostLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;
  const io = getIO();

  if (!userId) return next(new AppError("Unauthorized", 401));

  const post = await Post.findById(postId).populate("uploadedBy", "username");
  if (!post) return next(new AppError("Post not found", 404));

  const recipientId = post.uploadedBy._id.toString();
  const recipientUsername = (post.uploadedBy as any).username;

  const actor = await User.findById(userId).select("username");

  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });

    if (recipientId !== userId) {
      await Notification.deleteMany({
        recipient: recipientId,
        sender: userId,
        postId,
        type: "like",
      });
    }

    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      io.to(actorSocketId).emit("toast:feedback", {
        message: `You unliked ${recipientUsername}'s post`,
      });
    }
  } else {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });

    if (recipientId !== userId) {
      await Notification.create({
        recipient: recipientId,
        sender: userId,
        type: "like",
        postId,
        message: "liked your post",
      });

      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification:new", {
          type: "like",
          sender: { username: actor?.username },
          message: `${actor?.username} liked your post ❤️`,
        });
      }
    }

    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      io.to(actorSocketId).emit("toast:feedback", {
        message: `You liked ${recipientUsername}'s post ❤️`,
      });
    }
  }

  const updatedPost = await Post.findById(postId);

  res.status(200).json({
    success: true,
    data: {
      likes: updatedPost?.likes.map((id) => id.toString()) || [],
      alreadyLiked: !alreadyLiked,
    },
  });
});

export default togglePostLike;
