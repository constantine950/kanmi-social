import Post from "../../models/Post.ts";
import catchAsync from "../../utils/catchAsync.ts";

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

export default getPostsByUser;
