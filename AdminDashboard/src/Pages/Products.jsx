// src/pages/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  fetchAllCategories,
  fetchSubCategoriesByCategory,
  resetProductState,
} from "../app/features/productSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, categories, subCategories, loading, error, success } =
    useSelector((state) => state.product);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    subCategory: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (form.category) {
      dispatch(fetchSubCategoriesByCategory(form.category));
    }
  }, [form.category, dispatch]);

  useEffect(() => {
    if (success) {
      setForm({
        title: "",
        price: "",
        category: "",
        subCategory: "",
        image: null,
      });
      dispatch(resetProductState());
    }
  }, [success, dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    if (form.image) formData.append("image", form.image);

    dispatch(createProduct(formData));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6"
        onSubmit={handleAdd}
      >
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={form.subCategory}
          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
        >
          <option value="">Select SubCategory</option>
          {subCategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-full sm:col-auto"
        >
          Add Product
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p._id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <div>
              <span className="font-medium">{p.title}</span>{" "}
              <span className="text-gray-500">₹{p.price}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(p._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
