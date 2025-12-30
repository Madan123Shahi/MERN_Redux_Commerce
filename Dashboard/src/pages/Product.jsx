import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
} from "../app/features/productSlice";

export default function ProductPage() {
  const dispatch = useDispatch();
  const { products, categories, subCategories, loading } = useSelector(
    (state) => state.product
  );

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    price: "",
    image: null,
  });

  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProducts({ page: 1, limit: 1000, search }));
  }, [dispatch, search]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000
    );
  };

  const handleCreate = async () => {
    if (!form.title || !form.category || !form.subCategory || !form.price)
      return;

    let imageUrl = "";
    if (form.image) {
      const formData = new FormData();
      formData.append("file", form.image);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      imageUrl = data.secure_url;
    }

    const result = await dispatch(createProduct({ ...form, image: imageUrl }));
    if (createProduct.fulfilled.match(result)) {
      setForm({
        title: "",
        category: "",
        subCategory: "",
        price: "",
        image: null,
      });
      addToast("Product added successfully!");
    } else {
      addToast(result.payload || "Failed to add product", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) addToast("Product deleted!");
    else addToast(result.payload || "Delete failed", "error");
  };

  const categoryOptions = categories?.map((c) => ({
    value: c._id,
    label: c.name,
  }));
  const subCategoryOptions = subCategories?.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const filteredProducts = products.filter((p) =>
    search ? p.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toasts */}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`px-4 py-2 rounded-lg text-white shadow-md ${
                t.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">Product Dashboard</h1>

      {/* CREATE PRODUCT FORM */}
      <div className="flex flex-wrap gap-3 justify-center mb-8 bg-white p-4 rounded shadow">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Product Title"
          className="border p-2 rounded w-64"
        />

        <Select
          options={categoryOptions}
          value={
            categoryOptions?.find((c) => c.value === form.category) || null
          }
          onChange={(selected) =>
            setForm({ ...form, category: selected ? selected.value : "" })
          }
          placeholder="Category"
          isClearable
          className="w-64"
        />

        <Select
          options={subCategoryOptions}
          value={
            subCategoryOptions?.find((s) => s.value === form.subCategory) ||
            null
          }
          onChange={(selected) =>
            setForm({ ...form, subCategory: selected ? selected.value : "" })
          }
          placeholder="SubCategory"
          isClearable
          className="w-64"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded w-32"
        />

        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="border p-2 rounded w-32"
        />

        <button
          disabled={loading}
          onClick={handleCreate}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Products..."
          className="border p-2 rounded w-64"
        />
      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">SubCategory</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
              >
                <td className="p-3">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-3 font-semibold">{p.title}</td>
                <td className="p-3">
                  {categories.find((c) => c._id === p.category)?.name}
                </td>
                <td className="p-3">
                  {subCategories.find((s) => s._id === p.subCategory)?.name}
                </td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
