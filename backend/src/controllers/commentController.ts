import Comment from "../models/Comment.ts";
import Notification from "../models/Notification.ts";
import Post from "../models/Post.ts";
import User from "../models/User.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { getIO, onlineUsers } from "../socket.ts";

export const createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;

  if (!text) return next(new AppError("Comment text is required", 400));

  const post = await Post.findById(postId);
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

  // 🔔 Notify post owner
  const postOwnerId = post.uploadedBy.toString();
  if (postOwnerId !== userId) {
    const notification = await Notification.create({
      recipient: postOwnerId,
      sender: userId,
      type: "comment",
      postId,
      message: "commented on your post",
    });

    const io = getIO();
    const recipientSocketId = onlineUsers.get(postOwnerId);

    if (recipientSocketId) {
      const sender = await User.findById(userId).select("username");
      io.to(recipientSocketId).emit("notification:new", {
        type: "comment",
        message: notification.message,
        from: sender?.username,
        postId,
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
