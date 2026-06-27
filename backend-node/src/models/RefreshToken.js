import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    revoked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
