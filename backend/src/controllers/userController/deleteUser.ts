import cloudinary from "../../config/cloudinary.ts";
import BlacklistedToken from "../../models/BlacklistedToken.ts";
import Post from "../../models/Post.ts";
import User from "../../models/User.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import jwt from "jsonwebtoken";

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // blacklist access token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (decoded?.exp) {
      await BlacklistedToken.create({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  // cloudinary cleanup
  const posts = await Post.find(
    { uploadedBy: userId },
    { "image.publicId": 1 }
  );

  const postImagePublicIds = posts
    .map((p) => p.image?.publicId)
    .filter(Boolean) as string[];

  const cloudinaryTasks: Promise<unknown>[] = [];

  if (user.profilePicture?.publicId) {
    cloudinaryTasks.push(
      cloudinary.uploader.destroy(user.profilePicture.publicId)
    );
  }

  postImagePublicIds.forEach((publicId) => {
    cloudinaryTasks.push(cloudinary.uploader.destroy(publicId));
  });

  await Promise.allSettled(cloudinaryTasks);

  await Post.deleteMany({ uploadedBy: userId });
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "User and all related data deleted",
  });
});

export default deleteUser;
