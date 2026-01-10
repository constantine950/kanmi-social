import Comment from "../../models/Comment.ts";
import Notification from "../../models/Notification.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";

const deleteComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.userInfo?.user_id;

  const comment = await Comment.findById(commentId);
  if (!comment) return next(new AppError("Comment not found", 404));

  // Only owner can delete
  if (comment.userId.toString() !== userId) {
    return next(new AppError("Not authorized", 403));
  }

  // Delete related notification
  await Notification.deleteMany({
    sender: userId,
    postId: comment.postId,
    type: "comment",
  });

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted",
  });
});

export default deleteComment;
