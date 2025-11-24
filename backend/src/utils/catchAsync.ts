import { type NextFunction, type Response } from "express";
import { type UserRes, type UserInfoReq } from "../types.ts";

const catchAsync = (
  fn: (
    req: UserInfoReq,
    res: Response<UserRes>,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: UserInfoReq, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
