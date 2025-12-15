import mongoose, { Schema } from "mongoose";
import { type CustomProperty } from "../types.ts";

const UserSchema = new Schema<CustomProperty>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<CustomProperty>("User", UserSchema);
