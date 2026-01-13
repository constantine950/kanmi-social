import Comment from "../../models/Comment.js";
import catchAsync from "../../utils/catchAsync.js";

const getPostComments = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

export default getPostComments;
