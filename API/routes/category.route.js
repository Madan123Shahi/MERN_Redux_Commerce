import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
