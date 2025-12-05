import mongoose from "mongoose";
import { type CustomNotificationProperty } from "../types";

const NotificationSchema = new mongoose.Schema<CustomNotificationProperty>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    messagee: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<CustomNotificationProperty>(
  "Notification",
  NotificationSchema
);
