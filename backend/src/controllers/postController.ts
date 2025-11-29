import cloudinary from "../config/cloudinary.ts";
import Post from "../models/Post.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";

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

  res.status(201).json({
    success: true,
    message: "Post created",
    data: post,
  });
});

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate("uploadedBy", "_id username profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `All ${posts.length} posts fetched`,
    data: posts,
  });
});

const getPostsByUser = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const userPosts = await Post.find({ uploadedBy: userId })
    .populate("uploadedBy", "_id username profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "User posts fetched",
    data: userPosts,
  });
});

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

const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userId = req.userInfo?.user_id;

  if (!text) {
    return next(new AppError("Post text is required", 400));
  }

  const post = await Post.findById(postId);

  if (post?.uploadedBy.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not permitted, You did not own this post",
    });
  }

  let imageData = {
    url: post?.image.url,
    publicId: post?.image.publicId,
  };

  if (req.file) {
    await cloudinary.uploader.destroy(post?.image.publicId!);

    const uploaded = await uploadBufferToCloudinary(req.file.buffer);

    if (!uploaded) {
      return next(new AppError("Not able to upload image. Try again", 500));
    }

    imageData = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      text,
      image: imageData,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

export { createPost, getAllPosts, getPostsByUser, deletePost, updatePost };
