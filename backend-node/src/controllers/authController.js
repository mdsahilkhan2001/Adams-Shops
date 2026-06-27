import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from "../utils/tokenService.js";
import {
  sendEmail,
  createVerificationEmail,
  createPasswordResetEmail,
  createVerificationUrl,
  isSmtpConfigured
} from "../utils/emailService.js";
import {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidPasswordMatch
} from "../utils/validators.js";

const TOKEN_EXPIRY_MINUTES = 15;
const LOCK_DURATION_MINUTES = 15;

const resolveFrontendBaseUrl = (req) => {
  const origin = req?.headers?.origin || req?.headers?.referer;
  if (origin) {
    try {
      return new URL(origin).origin;
    } catch {
      // Fall through to the configured/default frontend URL.
    }
  }

  return (process.env.FRONTEND_URL || "http://localhost:5175").trim().replace(/\/$/, "");
};

const createRefreshCookie = (res, token) => {
  const maxAge = 1000 * 60 * 60 * 24 * 7;
  const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge,
    ...(cookieDomain && cookieDomain !== "localhost" && cookieDomain !== "127.0.0.1"
      ? { domain: cookieDomain }
      : {})
  });
};

const clearRefreshCookie = (res) => {
  const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    ...(cookieDomain && cookieDomain !== "localhost" && cookieDomain !== "127.0.0.1"
      ? { domain: cookieDomain }
      : {})
  });
};

const getDeviceInfo = (req) => {
  return req.headers["user-agent"] || "unknown device";
};

const getIpAddress = (req) => req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

const appendLoginHistory = async (user, ipAddress, deviceInfo, success) => {
  const historyEntry = {
    ipAddress,
    userAgent: deviceInfo,
    success,
    createdAt: new Date()
  };

  const updates = {
    $push: {
      loginHistory: {
        $each: [historyEntry],
        $position: 0,
        $slice: 10
      }
    }
  };

  if (success) {
    updates.$set = {
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      lastLogin: user.lastLogin
    };
  } else {
    updates.$set = {
      failedLoginAttempts: user.failedLoginAttempts,
      accountLockedUntil: user.accountLockedUntil
    };
  }

  await User.updateOne({ _id: user._id }, updates);
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    const frontendBaseUrl = resolveFrontendBaseUrl(req);

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password must include uppercase, lowercase, number, and symbol." });
    }

    if (!isValidPasswordMatch(password, confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash,
      role: "customer"
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await EmailVerificationToken.create({ user: user._id, token, expiresAt });
    await sendEmail({
      to: user.email,
      subject: "Verify your Adams Boutique email",
      html: createVerificationEmail(user.firstName, token, frontendBaseUrl)
    });
    const verificationUrl = createVerificationUrl(token, frontendBaseUrl);

    res.status(201).json({
      message: "Registration successful. Please verify your email before logging in.",
      verificationUrl: !isSmtpConfigured() ? verificationUrl : undefined,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const handleFailedLogin = async (user, req) => {
  const deviceInfo = getDeviceInfo(req);
  const ipAddress = getIpAddress(req);

  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.accountLockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
  }
  await appendLoginHistory(user, ipAddress, deviceInfo, false);
};

const handleSuccessfulLogin = async (user, req) => {
  user.failedLoginAttempts = 0;
  user.accountLockedUntil = null;
  user.lastLogin = new Date();
  await appendLoginHistory(user, getIpAddress(req), getDeviceInfo(req), true);
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked. Contact support." });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      return res.status(423).json({
        message: "Account temporarily locked due to repeated failed login attempts. Try again later."
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      await handleFailedLogin(user, req);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Check your inbox." });
    }

    await handleSuccessfulLogin(user, req);
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken({
      user,
      ipAddress: getIpAddress(req),
      deviceInfo: getDeviceInfo(req)
    });

    createRefreshCookie(res, refreshToken);

    res.json({
      message: "Login successful.",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminRoles = ["admin", "superadmin"];

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked." });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      return res.status(423).json({ message: "Account locked. Try again later." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      await handleFailedLogin(user, req);
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    await handleSuccessfulLogin(user, req);
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken({
      user,
      ipAddress: getIpAddress(req),
      deviceInfo: getDeviceInfo(req)
    });

    createRefreshCookie(res, refreshToken);

    res.json({
      message: "Admin login successful.",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
    }
    clearRefreshCookie(res);
    res.json({ message: "Logout successful." });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;
    if (!refreshTokenValue) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    const { payload, dbToken } = await verifyRefreshToken(refreshTokenValue);
    const user = await User.findById(payload.sub);
    if (!user || user.isBlocked) {
      throw new Error("Invalid refresh token.");
    }

    dbToken.revoked = true;
    await dbToken.save();

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = await createRefreshToken({
      user,
      ipAddress: getIpAddress(req),
      deviceInfo: getDeviceInfo(req)
    });
    createRefreshCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    clearRefreshCookie(res);
    res.status(401).json({ message: error.message || "Unable to refresh token." });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const frontendBaseUrl = resolveFrontendBaseUrl(req);
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({ message: "If your email is registered, a reset link was sent." });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordResetToken.create({ user: user._id, token, expiresAt });
    await sendEmail({
      to: user.email,
      subject: "Reset your Adams Boutique password",
      html: createPasswordResetEmail(user.firstName, token, frontendBaseUrl)
    });

    res.json({ message: "If your email is registered, a reset link was sent." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password must be strong." });
    }

    if (!isValidPasswordMatch(password, confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const resetRecord = await PasswordResetToken.findOne({ token, used: false });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Reset token is invalid or expired." });
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();
    resetRecord.used = true;
    await resetRecord.save();

    await RefreshToken.updateMany({ user: user._id }, { revoked: true });
    clearRefreshCookie(res);

    res.json({ message: "Password reset successfully. Please log in." });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    const record = await EmailVerificationToken.findOne({ token, used: false });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification token is invalid or expired." });
    }

    const user = await User.findById(record.user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }

    user.isVerified = true;
    await user.save();
    record.used = true;
    await record.save();

    res.json({ message: "Email verified successfully." });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const frontendBaseUrl = resolveFrontendBaseUrl(req);
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({ message: "Verification email sent if account exists." });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }

    await EmailVerificationToken.updateMany({ user: user._id, used: false }, { used: true });
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await EmailVerificationToken.create({ user: user._id, token, expiresAt });
    await sendEmail({
      to: user.email,
      subject: "Resend email verification",
      html: createVerificationEmail(user.firstName, token, frontendBaseUrl)
    });
    const verificationUrl = createVerificationUrl(token, frontendBaseUrl);

    res.json({
      message: "Verification email sent.",
      verificationUrl: !isSmtpConfigured() ? verificationUrl : undefined
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "New password must be strong." });
    }

    if (!isValidPasswordMatch(newPassword, confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different." });
    }

    const user = await User.findById(req.user._id);
    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    await RefreshToken.updateMany({ user: user._id }, { revoked: true });
    clearRefreshCookie(res);

    res.json({ message: "Password changed successfully. Please log in again." });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone && isValidPhone(phone)) user.phone = phone.trim();

    await user.save();
    res.json({ message: "Profile updated successfully.", user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  adminLogin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  getMe,
  updateProfile
};
