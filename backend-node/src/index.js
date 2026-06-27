import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";

const seedAdminUser = async () => {
  if (process.env.NODE_ENV === "production") return;

  const email = "syedusman3691@gmail.com";
  const password = "123456";
  const phone = "+15555550001";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log("Admin test user already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    firstName: "Syed",
    lastName: "Usman",
    email,
    phone,
    passwordHash,
    role: "admin",
    isVerified: true
  });
  console.log("Seeded admin test user:", email);
};

connectDatabase()
  .then(async () => {
    await seedAdminUser();
    app.listen(PORT, HOST, () => {
      console.log(`Adams Auth Server running on port ${PORT} (${HOST})`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
