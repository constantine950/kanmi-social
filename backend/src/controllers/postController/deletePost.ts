import cloudinary from "../../config/cloudinary.ts";
import Post from "../../models/Post.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";

const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.uploadedBy.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message:
        "Not permitted to delete this post, you can only delete post you owned",
    });
  }

  if (!post.image === null) {
    await cloudinary.uploader.destroy(post.image.publicId);
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    success: true,
    message: "Post deleted",
  });
});

export default deletePost;
