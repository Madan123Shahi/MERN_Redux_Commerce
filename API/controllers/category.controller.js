import Category from "../models/Category.Model.js";
import slugify from "slugify";

/* CREATE */
export const createCategory = async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  });

  res.status(201).json(category);
};

/* READ */
export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

/* UPDATE */
export const updateCategory = async (req, res) => {
  const { name, isActive } = req.body;

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      isActive,
    },
    { new: true }
  );

  res.json(updated);
};

/* DELETE */
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted successfully" });
};
