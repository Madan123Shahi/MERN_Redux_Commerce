import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: String,

    price: {
      type: Number,
      required: true,
    },
    discountPrice: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: [String],

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
