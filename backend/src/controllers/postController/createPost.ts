import Post from "../../models/Post.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper.js";

const createPost = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;
  const { text } = req.body;

  if (!userId) return next(new AppError("Unauthorized", 401));
  if (!text || text.trim().length === 0) {
    return next(new AppError("Post text is required", 400));
  }

  let imageData = null;

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer);
    if (!result) {
      return next(new AppError("Unable to upload to Cloudinary", 500));
    }

    imageData = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  // Create post
  const post = await Post.create({
    text,
    image: imageData,
    uploadedBy: userId,
  });

  // Populate uploadedBy field
  const populatedPost = await post.populate(
    "uploadedBy",
    "username profilePicture",
  );

  const uploadedByUser = populatedPost.uploadedBy as any;

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: {
      _id: populatedPost._id,
      text: populatedPost.text,
      image: populatedPost.image,
      uploadedBy: {
        _id: uploadedByUser._id,
        username: uploadedByUser.username,
        profilePicture: uploadedByUser.profilePicture,
      },
      likes: [],
      alreadyLiked: false,
      createdAt: (populatedPost as any).createdAt,
    },
  });
});

export default createPost;
