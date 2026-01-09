import BlacklistedToken from "../../models/BlacklistedToken.ts";
import catchAsync from "../../utils/catchAsync.ts";
import jwt from "jsonwebtoken";

const logoutUser = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (decoded?.exp) {
      await BlacklistedToken.create({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default logoutUser;
