import Post from "../../models/Post.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";

const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;
  const { text } = req.body;

  if (!userId) return next(new AppError("Unauthorized", 401));

  const post = await Post.findById(postId);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.uploadedBy.toString() !== userId) {
    return next(new AppError("You can only edit your own posts", 403));
  }

  if (text !== undefined) {
    post.text = text;
  }

  if (req.file) {
    if (post.image?.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "kanmi_posts",
    });

    post.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: {
      _id: post._id,
      text: post.text,
      image: post.image,
      likes: post.likes,
      alreadyLiked: post.likes.some((id) => id.toString() === userId),
    },
  });
});

export default updatePost;
