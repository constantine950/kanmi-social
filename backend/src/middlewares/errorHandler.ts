import { type NextFunction, type Request, type Response } from "express";
import AppError from "../utils/AppError.ts";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
export default errorHandler;
