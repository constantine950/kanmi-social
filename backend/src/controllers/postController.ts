import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.ts";
import Post from "../models/Post.ts";
import AppError from "../utils/AppError.ts";
import catchAsync from "../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../utils/cloudinaryHelper.ts";
import Notification from "../models/Notification.ts";
import { getIO, onlineUsers } from "../socket.ts";

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const userId = req.userInfo?.user_id?.toString();

  const posts = await Post.find()
    .populate("uploadedBy", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const normalizedPosts = posts.map((post) => {
    const likes = post.likes.map((id) => id.toString());

    return {
      ...post,
      likes,
      alreadyLiked: userId ? likes.includes(userId) : false,
    };
  });

  res.status(200).json({
    success: true,
    posts: normalizedPosts,
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

const togglePostLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;
  const io = getIO();

  const post = await Post.findById(postId);
  if (!post) return next(new AppError("post not found", 404));

  const alreadyLiked = post.likes.includes(userId!);
  let updatedAlreadyLiked: boolean;

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    updatedAlreadyLiked = false;
  } else {
    post.likes.push(userId!);
    updatedAlreadyLiked = true;
    if (post.uploadedBy.toString() !== userId) {
      const notification = await Notification.create({
        recipient: post.uploadedBy,
        sender: userId,
        type: "like",
        postId: post._id,
        message: "liked your post",
      });

      const recipientSocketId = onlineUsers.get(post.uploadedBy.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification:new", {
          message: notification.message,
          from: userId,
          postId: post._id,
        });
      }
    }
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: {
      likes: post.likes.map((id) => id.toString()),
      alreadyLiked: updatedAlreadyLiked,
    },
  });
});

const getTotalLikes = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const result = await Post.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    { $project: { totalLikes: { $size: "$likes" } } },
  ]);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getTrendingPosts = catchAsync(async (req, res, next) => {
  const trending = await Post.aggregate([
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $project: {
        text: 1,
        image: 1,
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        score: {
          $add: [
            { $size: "$likes" },
            { $multiply: [{ $size: "$comments" }, 2] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    data: trending,
  });
});

export {
  createPost,
  getAllPosts,
  getPostsByUser,
  deletePost,
  updatePost,
  togglePostLike,
  getTotalLikes,
  getTrendingPosts,
};
