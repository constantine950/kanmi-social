import Comment from "../models/Comment.ts";
import Notification from "../models/Notification.ts";
import Post from "../models/Post.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { io, onlineUsers } from "../utils/socket.ts";

const createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;

  // Create comment
  const comment = await Comment.create({ postId, userId, text });

  // Get post to find the owner
  const post = await Post.findById(postId);
  if (!post) return next(new AppError("Post not found", 404));

  const postOwnerId = post.uploadedBy.toString();

  // Notify the post owner if commenter is not the same person
  if (postOwnerId !== userId) {
    const notification = await Notification.create({
      recipient: postOwnerId,
      sender: userId,
      type: "comment",
      postId,
      message: "commented on your post",
    });

    const recipientSocketId = onlineUsers.get(postOwnerId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notification:new", {
        message: notification.message,
        from: userId,
        postId,
      });
    }
  }

  res.status(201).json({
    success: true,
    message: "Comment created",
    data: comment,
  });
});

const getPostComments = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId })
    .populate("userId", "username profilePicture")
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    message: "Post comments fetched",
    data: comments,
  });
});

export { createComment, getPostComments };
