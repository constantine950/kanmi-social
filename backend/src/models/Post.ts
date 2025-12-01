import mongoose from "mongoose";
import { type CustomPostProperty } from "../types.ts";

const PostSchema = new mongoose.Schema<CustomPostProperty>(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<CustomPostProperty>("Post", PostSchema);
