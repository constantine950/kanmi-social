import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync.ts";
import Post from "../../models/Post.ts";

const getTrendingPosts = catchAsync(async (req, res) => {
  const userId = req.userInfo!.user_id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const trending = await Post.aggregate([
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
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },

    {
      $addFields: {
        alreadyLiked: {
          $in: [
            new mongoose.Types.ObjectId(userId),
            { $ifNull: ["$likes", []] },
          ],
        },
        score: {
          $add: [
            { $size: { $ifNull: ["$likes", []] } },
            {
              $multiply: [{ $size: { $ifNull: ["$comments", []] } }, 2],
            },
          ],
        },
      },
    },

    { $sort: { score: -1, createdAt: -1 } },

    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        text: 1,
        image: 1,
        uploadedBy: 1,
        likes: 1,
        alreadyLiked: 1,
        createdAt: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: trending,
    hasMore: trending.length === limit,
  });
});

export default getTrendingPosts;
