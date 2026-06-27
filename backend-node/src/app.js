import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";

const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5175"])
  .map((origin) => origin.trim())
  .filter(Boolean);

const isPrivateNetworkHostname = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);

const isLocalDevOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      (protocol === "http:" || protocol === "https:") &&
      isPrivateNetworkHostname(hostname)
    );
  } catch {
    return false;
  }
};

app.use(helmet());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        configuredOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin));

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);

app.use("/api/auth", rateLimiter, authRoutes);
app.use("/api/admin", rateLimiter, adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "adams-auth" });
});

app.use(errorHandler);

export default app;
