import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import ApiError from "./utils/ApiError.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/**
 * Security Middleware
 */
app.use((helmet as any)());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ecom-assignment-frontend.vercel.app",
    ],
    credentials: true,
  }),
);

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Body Parsers
 */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Management API is running 🚀",
  });
});

/**
 * Diagnostics Endpoint
 */
app.get("/api/diagnose", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Diagnostics info",
    dbState: mongoose.connection.readyState,
    hasMongoUri: !!process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin", dashboardRoutes);

/**
 * 404 Route
 */
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found.`));
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;
