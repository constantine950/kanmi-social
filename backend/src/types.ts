import { type Request } from "express";
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
  file?: Express.Multer.File;
}

export interface UserRes {
  success: boolean;
  message: string;
  data: any;
}
