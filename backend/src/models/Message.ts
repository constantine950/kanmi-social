import mongoose from "mongoose";
import { type CustomMessageProperty } from "../types.ts";

const MessageSchema = new mongoose.Schema<CustomMessageProperty>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    image: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<CustomMessageProperty>("Message", MessageSchema);
