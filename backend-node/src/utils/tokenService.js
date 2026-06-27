import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
};

const createRefreshToken = async ({ user, ipAddress, deviceInfo }) => {
  const token = jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
      jti: uuidv4()
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  const expiresAt = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN?.replace("d", "")) || 7) * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    user: user._id,
    token,
    expiresAt,
    ipAddress,
    deviceInfo
  });

  return token;
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
const verifyRefreshToken = async (token) => {
  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const dbToken = await RefreshToken.findOne({ token, revoked: false }).populate("user");
  if (!dbToken || dbToken.expiresAt < new Date()) {
    throw new Error("Refresh token invalid or expired.");
  }
  return { payload, dbToken };
};

export { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken };
