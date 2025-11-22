import cloudinary from "../config/cloudinary.ts";

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { uploadToCloudinary };
