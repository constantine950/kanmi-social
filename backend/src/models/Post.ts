import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [], // Ensure likes is always an array
    },
  },
  {
    timestamps: true,
  },
);

// Add index for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ uploadedBy: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
