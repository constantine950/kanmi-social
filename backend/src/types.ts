import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface CustomProperty extends Document {
  username?: string;
  password?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export interface UserInfoReq extends Request {
  body: {
    username: string;
    password: string;
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
