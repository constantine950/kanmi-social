import Comment from "../models/Comment.ts";
import Notification from "../models/Notification.ts";
import Post from "../models/Post.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { getIO, onlineUsers } from "../socket.ts";
import User from "../models/User.ts";

export const createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;
  const io = getIO();

  if (!text) return next(new AppError("Comment text is required", 400));

  const post = await Post.findById(postId).populate("uploadedBy", "username");
  if (!post) return next(new AppError("Post not found", 404));

  const comment = await Comment.create({
    postId,
    userId,
    text,
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "userId",
    "username profilePicture"
  );

  const actor = await User.findById(userId).select("username");
  const recipientId = post.uploadedBy._id.toString();

  // 🔔 ONLY notify post owner
  if (recipientId !== userId) {
    await Notification.create({
      recipient: recipientId,
      sender: userId,
      type: "comment",
      postId,
      message: "commented on your post",
    });

    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notification:new", {
        type: "comment",
        sender: { username: actor?.username },
        message: `${actor?.username} commented on your post 💬`,
      });
    }
  }

  res.status(201).json({
    success: true,
    data: populatedComment,
  });
});

export const getPostComments = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: comments,
  });
});
