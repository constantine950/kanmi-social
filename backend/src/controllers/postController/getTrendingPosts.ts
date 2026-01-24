import { Types } from "mongoose";
import Post from "../../models/Post.js";
import catchAsync from "../../utils/catchAsync.js";

const getTrendingPosts = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id; // Get current user ID
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const posts = await Post.aggregate([
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    { $sort: { likesCount: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "uploadedBy",
        foreignField: "_id",
        as: "uploadedBy",
      },
    },
    { $unwind: "$uploadedBy" },
    {
      $project: {
        text: 1,
        image: 1,
        likes: 1,
        createdAt: 1,
        "uploadedBy._id": 1,
        "uploadedBy.username": 1,
        "uploadedBy.profilePicture": 1,
      },
    },
  ]);

  // Add alreadyLiked field for each post
  const postsWithLikeStatus = posts.map((post) => ({
    ...post,
    alreadyLiked: userId
      ? post.likes.some((id: Types.ObjectId) => id.toString() === userId)
      : false,
    likes: post.likes.map((id: Types.ObjectId) => id.toString()),
  }));

  res.status(200).json({
    success: true,
    posts: postsWithLikeStatus,
    page,
    hasMore: posts.length === limit,
  });
});

export default getTrendingPosts;
