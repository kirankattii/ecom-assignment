// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import Admin from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    // Find admin (password is select:false)
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!admin) {
      throw new ApiError(401, "Invalid email or password.");
    }

    // Compare password
    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password.");
    }

    // Generate JWT
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    res.status(200).json(
      new ApiResponse("Login successful.", {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
        },
      }),
    );
  },
);
