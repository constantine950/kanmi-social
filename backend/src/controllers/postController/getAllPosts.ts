import Post from "../../models/Post.js";
import catchAsync from "../../utils/catchAsync.js";

const getAllPosts = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("uploadedBy", "username profilePicture")
    .lean();

  const postsWithLikeStatus = posts
    .filter((post) => {
      if (!post.uploadedBy) {
        return false;
      }
      return true;
    })
    .map((post) => {
      const uploadedBy = post.uploadedBy as any;

      return {
        ...post,
        uploadedBy: {
          _id: uploadedBy._id,
          username: uploadedBy.username || "Unknown",
          profilePicture: uploadedBy.profilePicture || null,
        },
        alreadyLiked: userId
          ? post.likes?.some((id) => id && id.toString() === userId) || false
          : false,
        likes: post.likes?.filter((id) => id).map((id) => id.toString()) || [],
      };
    });

  res.status(200).json({
    success: true,
    posts: postsWithLikeStatus,
    page,
    hasMore: posts.length === limit,
  });
});

export default getAllPosts;
