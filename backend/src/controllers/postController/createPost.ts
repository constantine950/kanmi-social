import Post from "../../models/Post.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper.ts";

const createPost = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const userId = req.userInfo?.user_id;

  if (!text) {
    return next(new AppError("Post text is required", 400));
  }

  let imageData = null;

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer);

    if (!uploaded) {
      return next(new AppError("Not able to upload image. Try again", 500));
    }

    imageData = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const post = await Post.create({
    uploadedBy: userId,
    text,
    image: imageData,
  });

  const populatedPost = await post.populate(
    "uploadedBy",
    "username profilePicture"
  );

  res.status(201).json({
    success: true,
    message: "Post created",
    data: populatedPost,
  });
});

export default createPost;
