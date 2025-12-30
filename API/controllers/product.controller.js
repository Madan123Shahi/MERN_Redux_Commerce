import Product from "../models/Product.Model.js";
import Category from "../models/Category.Model.js";
import SubCategory from "../models/SubCategory.Model.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

/* CREATE PRODUCT */
export const createProduct = catchAsync(async (req, res, next) => {
  const { title, price, category, subCategory, description, stock } = req.body;

  if (!title || !price || !category || !subCategory) {
    return next(
      new AppError("Title, price, category, and subcategory are required", 400)
    );
  }

  const categoryExists = await Category.findById(category);
  const subCategoryExists = await SubCategory.findById(subCategory);

  if (!categoryExists) return next(new AppError("Category not found", 404));
  if (!subCategoryExists)
    return next(new AppError("Subcategory not found", 404));

  let imageUrls = [];
  if (req.files?.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
  }

  const product = await Product.create({
    title,
    slug: slugify(title, { lower: true, strict: true }),
    description,
    price,
    discountPrice: req.body.discountPrice || 0,
    category,
    subCategory,
    stock: stock || 0,
    images: imageUrls,
    status: req.body.status || "draft",
  });

  res.status(201).json(product);
});

/* GET ALL PRODUCTS */
export const getProducts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, category, subCategory, status } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (status) filter.status = status;

  const products = await Product.find(filter)
    .populate("category", "name")
    .populate("subCategory", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
});

/* GET SINGLE PRODUCT */
export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subCategory", "name");

  if (!product) return next(new AppError("Product not found", 404));

  res.json(product);
});

/* UPDATE PRODUCT */
export const updateProduct = catchAsync(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  if (req.files?.images) {
    let imageUrls = [];
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
    req.body.images = imageUrls;
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) return next(new AppError("Product not found", 404));

  res.json(updated);
});

/* DELETE PRODUCT */
export const deleteProduct = catchAsync(async (req, res, next) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new AppError("Product not found", 404));

  res.json({ message: "Product deleted successfully" });
});
