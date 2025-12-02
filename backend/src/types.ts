import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";

export interface CustomProperty extends Document {
  username?: string;
  password?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export interface CustomPostProperty extends Document {
  uploadedBy: Types.ObjectId;
  text: string;
  image: {
    url: string;
    publicId: string;
  };
  likes: string[];
}

export interface CustomNotificationProperty extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: string;
  postId: Types.ObjectId;
  message: string;
  read: boolean;
}

export interface UserInfoReq extends Request {
  body: {
    username: string;
    password: string;
    newPassword: string;
    text: string;
  };
  userInfo?: CustomJwtPayload;
  file?: Express.Multer.File;
}

export interface CustomJwtPayload extends JwtPayload {
  user_id: string;
  username: string;
  profilePicture: {
    url: string;
    publicId: string;
  };
}

export interface UserRes {
  success: boolean;
  message?: string;
  data?: any;
}
