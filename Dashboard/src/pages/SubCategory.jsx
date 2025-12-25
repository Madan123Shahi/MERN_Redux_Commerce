// src/pages/SubCategory.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubCategories,
  createSubCategory,
  deleteSubCategory,
} from "../app/features/subCategorySlice";
import { fetchCategories } from "../app/features/categorySlice";

export default function SubCategory() {
  const dispatch = useDispatch();
  const { subCategories, loading, total, error } = useSelector(
    (state) => state.subCategory
  );
  const { categories } = useSelector((state) => state.category);

  const [form, setForm] = useState({ name: "", category: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    dispatch(createSubCategory(form)).then(() =>
      setForm({ name: "", category: "" })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this subcategory?")) {
      dispatch(deleteSubCategory(id));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add SubCategory</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="SubCategory Name"
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add SubCategory"}
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {subCategories.map((sub) => (
          <li key={sub._id} className="flex justify-between border p-2 rounded">
            <span>{sub.name}</span>
            <button
              onClick={() => handleDelete(sub._id)}
              className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
