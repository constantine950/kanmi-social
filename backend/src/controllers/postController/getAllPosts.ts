import Post from "../../models/Post.ts";
import catchAsync from "../../utils/catchAsync.ts";

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

export default getAllPosts;
