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

// export const getCategories = async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 5;
//   const search = req.query.search || "";

//   const query = search ? { name: { $regex: search, $options: "i" } } : {};

//   const total = await Category.countDocuments(query);

//   const categories = await Category.find(query)
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit);

//   res.json({ categories, total });
// };

export const getCategories = async (req, res) => {
  const { page = 1, limit = 5, search = "", all } = req.query;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  if (all === "true") {
    const categories = await Category.find(query).sort({ createdAt: -1 });
    return res.json({ categories, total: categories.length });
  }

  const total = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ categories, total });
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
