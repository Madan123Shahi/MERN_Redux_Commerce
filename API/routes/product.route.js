import express from "express";
import fileUpload from "express-fileupload"; // For handling image uploads
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Enable file uploads
router.use(
  fileUpload({
    useTempFiles: true, // Store files temporarily
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
