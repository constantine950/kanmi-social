import cloudinary from "../../config/cloudinary.ts";
import Post from "../../models/Post";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper";

const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userId = req.userInfo?.user_id;

  if (!text || !text.trim()) {
    return next(new AppError("Post text is required", 400));
  }

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.uploadedBy.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not permitted, you do not own this post",
    });
  }

  let imageData = post.image ?? null;

  // Handle image replacement
  if (req.file) {
    if (post.image?.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    const uploaded = await uploadBufferToCloudinary(req.file.buffer);
    if (!uploaded) {
      return next(new AppError("Image upload failed. Try again", 500));
    }

    imageData = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      text: text.trim(),
      image: imageData,
    },
    { new: true, runValidators: true }
  ).populate("uploadedBy", "username profilePicture");

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

export default updatePost;
