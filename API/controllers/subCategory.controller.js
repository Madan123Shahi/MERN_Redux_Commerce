import SubCategory from "../models/SubCategory.Model.js";
import slugify from "slugify";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

/* =========================
   CREATE SUB CATEGORY
========================= */
export const createSubCategory = catchAsync(async (req, res, next) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return next(new AppError("Name and category are required", 400));
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existing = await SubCategory.findOne({ slug, category });
  if (existing) {
    return next(
      new AppError("SubCategory already exists in this category", 409)
    );
  }

  let subCategory = await SubCategory.create({
    name,
    slug,
    category,
  });

  // 🔥 THIS IS THE FIX
  subCategory = await subCategory.populate("category", "name");

  res.status(201).json(subCategory);
});

/* =========================
   GET ALL SUB CATEGORIES
========================= */
export const getSubCategories = catchAsync(async (req, res, next) => {
  const { category } = req.query;

  const query = {};
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return next(new AppError("Invalid category ID", 400));
    }
    query.category = category;
  }

  const subCategories = await SubCategory.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    subCategories,
    total: subCategories.length,
  });
});

/* =========================
   UPDATE SUB CATEGORY
========================= */
export const updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid SubCategory ID", 400));
  }

  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = slugify(name, { lower: true, strict: true });
  }
  if (typeof isActive === "boolean") updateData.isActive = isActive;

  const updated = await SubCategory.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) return next(new AppError("SubCategory not found", 404));

  // Return updated object directly
  res.status(200).json(updated);
});

/* =========================
   DELETE SUB CATEGORY
========================= */
export const deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid SubCategory ID", 400));
  }

  const deleted = await SubCategory.findByIdAndDelete(id);

  if (!deleted) return next(new AppError("SubCategory not found", 404));

  // Return deleted object or simple message
  res.status(200).json({ message: "SubCategory deleted successfully" });
});
