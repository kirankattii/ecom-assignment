import { Request, Response } from "express";
import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const [totalProducts, activeProducts, lowStockProducts, categories, latestProducts] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Product.countDocuments({ stock: { $lt: 10 } }),
        Product.distinct("category"),
        Product.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    res.status(200).json(
      new ApiResponse("Dashboard stats fetched successfully.", {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalCategories: categories.length,
        latestProducts,
      }),
    );
  },
);
