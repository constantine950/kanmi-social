import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import Notification from "../../models/Notification.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";

const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;

  if (!userId) return next(new AppError("Unauthorized", 401));

  const post = await Post.findById(postId);
  if (!post) return next(new AppError("Post not found", 404));

  // VERIFY OWNERSHIP
  if (post.uploadedBy.toString() !== userId) {
    return next(new AppError("You can only delete your own posts", 403));
  }

  // Delete image from cloudinary if exists
  if (post.image?.publicId) {
    await cloudinary.uploader.destroy(post.image.publicId);
  }

  // Delete associated comments
  await Comment.deleteMany({ postId });

  // Delete associated notifications
  await Notification.deleteMany({ postId });

  // Delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

export default deletePost;
