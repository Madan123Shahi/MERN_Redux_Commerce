// src/pages/CategoriesPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  resetCategoryState,
} from "../app/features/categorySlice";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, total, loading, error, success } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 10, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setName("");
      dispatch(resetCategoryState());
    }
  }, [success, dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (name) dispatch(createCategory({ name }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      <form className="flex gap-2 mb-6" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New Category Name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c._id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>{c.name}</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(c._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
