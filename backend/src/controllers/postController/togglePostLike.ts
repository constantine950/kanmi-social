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
  const isOwnPost = recipientId === userId;

  const actor = await User.findById(userId).select("username");
  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    // UNLIKE
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });

    // Only delete notification if not own post
    if (!isOwnPost) {
      await Notification.deleteMany({
        recipient: recipientId,
        sender: userId,
        postId,
        type: "like",
      });
    }

    // Send feedback to actor
    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      const message = isOwnPost
        ? "You unliked your own post"
        : `You unliked ${recipientUsername}'s post`;

      io.to(actorSocketId).emit("toast:feedback", { message });
    }
  } else {
    // LIKE
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });

    // Only create notification if not own post
    if (!isOwnPost) {
      await Notification.create({
        recipient: recipientId,
        sender: userId,
        type: "like",
        postId,
        message: "liked your post",
      });

      // Send notification to recipient
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification:new", {
          type: "like",
          sender: { username: actor?.username },
          message: `${actor?.username} liked your post ❤️`,
        });
      }
    }

    // Send feedback to actor
    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      const message = isOwnPost
        ? "You liked your own post ❤️"
        : `You liked ${recipientUsername}'s post ❤️`;

      io.to(actorSocketId).emit("toast:feedback", { message });
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
