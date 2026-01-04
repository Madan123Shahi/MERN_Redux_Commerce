// src/pages/SubCategoriesPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubCategories,
  createSubCategory,
  deleteSubCategory,
  resetSubCategoryState,
} from "../app/features/subCategorySlice";
import { fetchAllCategories } from "../app/features/categorySlice";

export default function SubCategoriesPage() {
  const dispatch = useDispatch();
  const { subCategories, loading, error, success } = useSelector(
    (state) => state.subCategory
  );
  const { categories } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    dispatch(fetchSubCategories());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setName("");
      setCategoryId("");
      dispatch(resetSubCategoryState());
    }
  }, [success, dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (name && categoryId) {
      dispatch(createSubCategory({ name, category: categoryId }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubCategory(id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sub Categories</h1>

      <form className="flex gap-2 mb-6" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New SubCategory Name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 rounded flex-1"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

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
        {subCategories.map((s) => (
          <li
            key={s._id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <div>
              <span className="font-medium">{s.name}</span>{" "}
              <span className="text-gray-500">
                ({s.category?.name || "No Category"})
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(s._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
