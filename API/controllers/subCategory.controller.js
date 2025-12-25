import SubCategory from "../models/SubCategory.Model.js";
import slugify from "slugify";

/* CREATE */
export const createSubCategory = async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    category,
  });

  res.status(201).json(subCategory);
};

/* READ */
export const getSubCategories = async (req, res) => {
  const subCategories = await SubCategory.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json(subCategories);
};

/* UPDATE */
export const updateSubCategory = async (req, res) => {
  const { name, isActive } = req.body;

  const updated = await SubCategory.findByIdAndUpdate(
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
export const deleteSubCategory = async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.json({ message: "SubCategory deleted successfully" });
};
