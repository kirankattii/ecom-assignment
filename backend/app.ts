import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import ApiError from "./utils/ApiError.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
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
  })
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
