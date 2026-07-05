import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteMultipleImages, uploadMultipleImages, } from "../services/cloudinary.service.js";
import mongoose from "mongoose";
export const createProduct = asyncHandler(async (req, res) => {
    console.log("📥 POST /api/products - Received request.");
    console.log("📝 Request headers:", req.headers);
    console.log("📝 Body parameters:", req.body);
    const { name, description, category, price, stock } = req.body || {};
    /**
     * Validation
     */
    if (!name?.trim()) {
        console.warn("⚠️ Validation error: product name is missing or empty.");
        throw new ApiError(400, "Product name is required.");
    }
    if (!description?.trim()) {
        console.warn("⚠️ Validation error: description is missing or empty.");
        throw new ApiError(400, "Product description is required.");
    }
    if (!category?.trim()) {
        console.warn("⚠️ Validation error: category is missing or empty.");
        throw new ApiError(400, "Product category is required.");
    }
    if (price === undefined || price === null) {
        console.warn("⚠️ Validation error: price is missing.");
        throw new ApiError(400, "Product price is required.");
    }
    if (stock === undefined || stock === null) {
        console.warn("⚠️ Validation error: stock is missing.");
        throw new ApiError(400, "Product stock is required.");
    }
    /**
     * Duplicate Name Check
     */
    console.log(`🔍 Checking if product name '${name.trim()}' already exists...`);
    const existingProduct = await Product.findOne({
        name: name.trim(),
    });
    if (existingProduct) {
        console.warn(`⚠️ Duplicate check failed: product '${name.trim()}' already exists.`);
        throw new ApiError(409, "Product already exists.");
    }
    /**
     * Images
     */
    const files = req.files;
    console.log(`🖼️ Uploaded files count: ${files ? files.length : 0}`);
    if (!files || files.length === 0) {
        console.warn("⚠️ Validation error: no product images provided.");
        throw new ApiError(400, "Please upload at least one product image.");
    }
    /**
     * Upload Images to Cloudinary
     */
    console.log(`☁️ Uploading ${files.length} images to Cloudinary...`);
    const uploadedImages = await uploadMultipleImages(files, "products");
    console.log("✅ Successfully uploaded images to Cloudinary:", uploadedImages);
    /**
     * Create Product
     */
    console.log("💾 Creating product record in database...");
    const product = await Product.create({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
        images: uploadedImages,
    });
    console.log("✅ Successfully created product record:", product._id);
    res
        .status(201)
        .json(new ApiResponse("Product created successfully.", product));
});
export const getAllProducts = asyncHandler(async (req, res) => {
    const { search = "", category, page = "1", limit = "10", sort = "newest", isActive, } = req.query;
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;
    /**
     * Build Filter
     */
    const filter = {};
    if (isActive !== undefined) {
        if (isActive !== "all") {
            filter.isActive = isActive === "true";
        }
    }
    else {
        filter.isActive = true;
    }
    // Search by name
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }
    // Filter by category
    if (category) {
        filter.category = category;
    }
    /**
     * Sorting
     */
    let sortOption = {
        createdAt: -1,
    };
    switch (sort) {
        case "price_asc":
            sortOption = { price: 1 };
            break;
        case "price_desc":
            sortOption = { price: -1 };
            break;
        case "name_asc":
            sortOption = { name: 1 };
            break;
        case "name_desc":
            sortOption = { name: -1 };
            break;
        default:
            sortOption = { createdAt: -1 };
    }
    /**
     * Execute Queries in Parallel
     */
    const [products, totalProducts] = await Promise.all([
        Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .lean(),
        Product.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalProducts / limitNumber);
    res.status(200).json(new ApiResponse("Products fetched successfully.", {
        products,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalProducts,
            totalPages,
        },
    }));
});
export const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    /**
     * Validate MongoDB ObjectId
     */
    if (typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid product ID.");
    }
    /**
     * Find Product
     */
    const product = await Product.findById(id).lean();
    if (!product) {
        throw new ApiError(404, "Product not found.");
    }
    res
        .status(200)
        .json(new ApiResponse("Product fetched successfully.", product));
});
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    /**
     * Validate ObjectId
     */
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID.");
    }
    const { name, description, category, price, stock, isActive } = req.body || {};
    const files = req.files;
    // Optimization: If no new images are being uploaded, perform a single atomic findByIdAndUpdate
    if (!files || files.length === 0) {
        const updateData = {};
        if (name !== undefined) {
            updateData.name = name.trim();
        }
        if (description !== undefined) {
            updateData.description = description.trim();
        }
        if (category !== undefined) {
            updateData.category = category.trim();
        }
        if (price !== undefined) {
            const parsedPrice = Number(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                throw new ApiError(400, "Invalid price.");
            }
            updateData.price = parsedPrice;
        }
        if (stock !== undefined) {
            const parsedStock = Number(stock);
            if (isNaN(parsedStock) || parsedStock < 0) {
                throw new ApiError(400, "Invalid stock.");
            }
            updateData.stock = parsedStock;
        }
        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        if (!updatedProduct) {
            throw new ApiError(404, "Product not found.");
        }
        res
            .status(200)
            .json(new ApiResponse("Product updated successfully.", updatedProduct));
        return;
    }
    /**
     * If new images are provided, we must find the product first,
     * upload new images, and delete old images.
     */
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found.");
    }
    if (name !== undefined) {
        product.name = name.trim();
    }
    if (description !== undefined) {
        product.description = description.trim();
    }
    if (category !== undefined) {
        product.category = category.trim();
    }
    if (price !== undefined) {
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            throw new ApiError(400, "Invalid price.");
        }
        product.price = parsedPrice;
    }
    if (stock !== undefined) {
        const parsedStock = Number(stock);
        if (isNaN(parsedStock) || parsedStock < 0) {
            throw new ApiError(400, "Invalid stock.");
        }
        product.stock = parsedStock;
    }
    if (isActive !== undefined) {
        product.isActive = isActive;
    }
    /**
     * Replace Images
     */
    const publicIds = product.images.map((image) => image.publicId);
    deleteMultipleImages(publicIds).catch((err) => {
        console.error("❌ Failed to delete old Cloudinary images in background:", err);
    });
    const uploadedImages = await uploadMultipleImages(files, "products");
    product.images = uploadedImages;
    await product.save();
    res
        .status(200)
        .json(new ApiResponse("Product updated successfully.", product));
});
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    /**
     * Validate ObjectId
     */
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID.");
    }
    /**
     * Find Product
     */
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found.");
    }
    /**
     * Delete Images From Cloudinary in background (non-blocking)
     */
    if (product.images.length > 0) {
        const publicIds = product.images.map((image) => image.publicId);
        deleteMultipleImages(publicIds).catch((err) => {
            console.error("❌ Failed to delete Cloudinary images in background:", err);
        });
    }
    /**
     * Delete Product
     */
    await product.deleteOne();
    res
        .status(200)
        .json(new ApiResponse("Product deleted successfully.", null));
});
