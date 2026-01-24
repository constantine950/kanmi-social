import Post from "../../models/Post.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;
  const { text } = req.body;

  if (!userId) return next(new AppError("Unauthorized", 401));
  if (!text || text.trim().length === 0) {
    return next(new AppError("Post text is required", 400));
  }

  let imageData = null;

  // Upload image to cloudinary if provided
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "kanmi_posts",
    });

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

  // Type assertion for populated uploadedBy
  const uploadedByUser = populatedPost.uploadedBy as any;

  // Return post with proper structure
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
