import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    ipAddress: { type: String },
    userAgent: { type: String },
    device: { type: String },
    success: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["guest", "customer", "admin", "superadmin"],
      default: "customer"
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
    lastLogin: { type: Date },
    loginHistory: { type: [loginHistorySchema], default: [] }
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
