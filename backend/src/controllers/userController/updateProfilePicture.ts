import cloudinary from "../../config/cloudinary.ts";
import User from "../../models/User.ts";
import AppError from "../../utils/AppError.ts";
import catchAsync from "../../utils/catchAsync.ts";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryHelper.ts";

const updateProfilePicture = catchAsync(async (req, res, next) => {
  const userId = req.userInfo?.user_id;

  if (!req.file) {
    return next(new AppError("File required", 400));
  }

  // Fetch user
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.profilePicture?.publicId) {
    await cloudinary.uploader.destroy(user.profilePicture.publicId);
  }

  const uploaded = await uploadBufferToCloudinary(req.file.buffer);
  if (!uploaded) {
    return next(new AppError("Unable to upload to Cloudinary", 500));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile picture updated",
    data: updatedUser?.profilePicture,
  });
});

export default updateProfilePicture;
