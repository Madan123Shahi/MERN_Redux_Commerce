// src/pages/Category.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../app/features/categorySlice";

export default function Category() {
  const dispatch = useDispatch();
  const { categories, loading, total, error } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchCategories({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const handleCreate = () => {
    if (!name) return;
    dispatch(createCategory({ name })).then(() => setName(""));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Categories</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-400 hover:bg-green-500 px-4 py-2 rounded text-white"
        >
          Add
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories"
        className="border p-2 rounded mb-4 w-full"
      />

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c._id} className="flex justify-between border p-2 rounded">
            <span>{c.name}</span>
            <button
              onClick={() => handleDelete(c._id)}
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
