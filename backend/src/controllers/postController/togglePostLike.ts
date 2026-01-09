import Notification from "../../models/Notification.ts";
import Post from "../../models/Post";
import User from "../../models/User.ts";
import { getIO, onlineUsers } from "../../socket.ts";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync.ts";

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

  const alreadyLiked = post.likes.includes(userId);

  // Unlike
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id !== userId);

    // Delete notification
    if (recipientId !== userId) {
      await Notification.deleteMany({
        recipient: recipientId,
        sender: userId,
        postId: post._id,
        type: "like",
      });
    }

    // Actor toast only
    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      io.to(actorSocketId).emit("toast:feedback", {
        message: `You unliked ${recipientUsername}'s post`,
      });
    }
  } else {
    // LIKE
    post.likes.push(userId);

    if (recipientId !== userId) {
      await Notification.create({
        recipient: recipientId,
        sender: userId,
        type: "like",
        postId: post._id,
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

    // Actor toast
    const actorSocketId = onlineUsers.get(userId);
    if (actorSocketId) {
      io.to(actorSocketId).emit("toast:feedback", {
        message: `You liked ${recipientUsername}'s post ❤️`,
      });
    }
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: {
      likes: post.likes,
      alreadyLiked: !alreadyLiked,
    },
  });
});

export default togglePostLike;
