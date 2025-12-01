import Comment from "../models/Comment.ts";
import catchAsync from "../utils/catchAsync.ts";

const createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.userInfo?.user_id;

  const comment = await Comment.create({ postId, userId, text });

  res.status(201).json({
    success: true,
    message: "Comment created",
    data: comment,
  });
});

const getPostComments = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId })
    .populate("userId", "username profilePicture")
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    message: "Post comments fetched",
    data: comments,
  });
});

export { createComment, getPostComments };
