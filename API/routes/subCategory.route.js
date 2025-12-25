import express from "express";
import {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createSubCategory);
router.get("/", getSubCategories);
router.put("/:id", protect, adminOnly, updateSubCategory);
router.delete("/:id", protect, adminOnly, deleteSubCategory);

export default router;
