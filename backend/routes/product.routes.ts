import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * Public Routes
 */
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

/**
 * Protected Routes (Admin)
 */
router.post("/", verifyJWT, upload.array("images", 5), createProduct);

router.put("/:id", verifyJWT, upload.array("images", 5), updateProduct);

router.delete("/:id", verifyJWT, deleteProduct);

export default router;
