import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
