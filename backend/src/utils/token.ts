import jwt from "jsonwebtoken";

export const signAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_KEY!, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_KEY!, {
    expiresIn: "7d",
  });
};
