import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../app/features/categorySlice";
import DeleteConfirmModal from "../components/DeleteConfirmModel";

export default function Category() {
  const dispatch = useDispatch();
  const { categories, loading, total, error } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  // 🔴 delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const handleCreate = () => {
    if (!name) return;
    dispatch(createCategory({ name })).then(() => setName(""));
  };

  // open modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // confirm delete
  const handleConfirmDelete = async () => {
    await dispatch(deleteCategory(deleteId));
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  // cancel delete
  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 text-gray-600">Categories</h1>

      {error && <p className="text-red-600">{error}</p>}

      {/* Create category */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 p-2 rounded flex-1 hover:ring-2 hover:ring-green-300"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-400 hover:bg-green-500 px-4 py-2 rounded text-white"
        >
          Add
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories"
        className="border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 p-2 rounded mb-4 w-full hover:ring-2 hover:ring-green-300"
      />

      {/* Category list */}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c._id}
            className="flex justify-between border-2 border-green-400 p-2 rounded items-center text-gray-500 hover:ring-2 hover:ring-green-300"
          >
            <span>{c.name}</span>
            <button
              onClick={() => handleDeleteClick(c._id)}
              className="bg-green-400 hover:bg-green-500 text-white px-2 py-1 rounded"
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
          className="px-3 py-1  rounded disabled:opacity-80 bg-green-400 text-white"
        >
          Prev
        </button>
        <span className="px-4 py-1 rounded-full bg-green-500 text-white font-semibold shadow">
          {page}
        </span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-white rounded disabled:opacity-50 bg-green-400"
        >
          Next
        </button>
      </div>

      {/* 🔥 Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
