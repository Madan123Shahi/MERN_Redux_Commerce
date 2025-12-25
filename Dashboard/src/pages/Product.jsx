import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
} from "../app/features/productSlice";

export default function ProductPage() {
  const dispatch = useDispatch();
  const { products, categories, subCategories, loading, total, error } =
    useSelector((state) => state.product);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    price: "",
    image: null,
  });

  const [page, setPage] = useState(1);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProducts({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (file) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setImageUploading(false);
    return data.secure_url;
  };

  /* ---------------- CREATE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (form.image) {
      imageUrl = await handleImageUpload(form.image);
    }

    dispatch(
      createProduct({
        ...form,
        image: imageUrl,
      })
    );

    setForm({
      title: "",
      category: "",
      subCategory: "",
      price: "",
      image: null,
    });
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* -------- ADD PRODUCT -------- */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          placeholder="Product Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={form.subCategory}
          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select SubCategory</option>
          {subCategories
            .filter((s) => s.category === form.category)
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading || imageUploading}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          {loading || imageUploading ? "Processing..." : "Add Product"}
        </button>
      </form>

      {/* -------- SEARCH -------- */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products"
        className="border p-2 rounded w-full max-w-md mb-4"
      />

      {/* -------- PRODUCT LIST -------- */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-green-400 text-white">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">SubCategory</th>
              <th className="p-2">Price</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.title}</td>
                <td className="p-2">
                  {categories.find((c) => c._id === p.category)?.name}
                </td>
                <td className="p-2">
                  {subCategories.find((s) => s._id === p.subCategory)?.name}
                </td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">
                  {p.image && (
                    <img src={p.image} className="w-12 h-12 rounded" />
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-400 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------- PAGINATION -------- */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>
        <span>{page}</span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
