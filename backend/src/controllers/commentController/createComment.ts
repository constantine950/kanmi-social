import Comment from "../../models/Comment.js";
import Notification from "../../models/Notification.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import { getIO, onlineUsers } from "../../socket.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

const createComment = catchAsync(async (req, res, next) => {
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

  // ONLY notify post owner
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

export default createComment;
