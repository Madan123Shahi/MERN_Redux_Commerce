import Product from "../models/Product.Model.js";
import slugify from "slugify";

/* CREATE */
export const createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    slug: slugify(req.body.title, { lower: true, strict: true }),
  });

  res.status(201).json(product);
};

/* READ */
export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("subCategory", "name")
    .sort({ createdAt: -1 });
  const total = await Product.countDocuments(); // for pagination
  res.json({ products, total });
};

/* UPDATE */
export const updateProduct = async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
};

/* DELETE */
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
};
