import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
const errorHandler = (err, req, res, next) => {
    console.error(err);
    /**
     * Custom API Errors
     */
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
        return;
    }
    /**
     * Multer Errors
     */
    if (err instanceof multer.MulterError) {
        let message = err.message;
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "Each image must not exceed 5 MB.";
                break;
            case "LIMIT_FILE_COUNT":
                message = "Maximum 5 images are allowed.";
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = "Unexpected file field.";
                break;
        }
        res.status(400).json({
            success: false,
            message,
        });
        return;
    }
    /**
     * Invalid file type
     */
    if (err instanceof Error) {
        if (err.message === "Only JPG, JPEG, PNG and WEBP image files are allowed.") {
            res.status(400).json({
                success: false,
                message: err.message,
            });
            return;
        }
    }
    /**
     * Invalid Mongo ObjectId
     */
    if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            message: "Invalid resource ID.",
        });
        return;
    }
    /**
     * Mongoose Validation Errors
     */
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((error) => error.message);
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
        return;
    }
    /**
     * Duplicate Key Error
     */
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        res.status(409).json({
            success: false,
            message: `${field} already exists.`,
        });
        return;
    }
    /**
     * JWT Errors (fallback)
     */
    if (err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
        return;
    }
    /**
     * Unknown Errors
     */
    res.status(500).json({
        success: false,
        message: "Internal Server Error.",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
export default errorHandler;
