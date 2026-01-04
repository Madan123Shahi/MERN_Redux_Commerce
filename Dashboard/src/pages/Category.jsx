import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../app/features/categorySlice";
import DeleteConfirmModal from "../components/DeleteConfirmModel";
import CategoryRow from "../components/CategoryRow";

export default function Category() {
  const dispatch = useDispatch();
  const { categories, loading, total, error } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;
  const [successFlash, setSuccessFlash] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories({ page, limit, search }));
  }, [dispatch, page, search]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      addToast("Category name is required", "error");
      return;
    }

    const resultAction = await dispatch(createCategory({ name: name.trim() }));

    if (createCategory.fulfilled.match(resultAction)) {
      setSuccessFlash(true);
      setTimeout(() => setSuccessFlash(false), 500);
      setName("");
      addToast("Category added successfully!");
    } else {
      addToast(resultAction.payload || "Failed to add category", "error");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const resultAction = await dispatch(deleteCategory(deleteId));

    setIsDeleteOpen(false);
    setDeleteId(null);

    if (deleteCategory.fulfilled.match(resultAction)) {
      addToast("Category deleted successfully!");

      // total after deletion
      const newTotal = total - 1;
      const totalPages = Math.ceil(newTotal / limit);

      // if current page becomes invalid, go back one page
      const safePage = page > totalPages && totalPages > 0 ? totalPages : page;

      if (safePage !== page) {
        setPage(safePage);
      } else {
        dispatch(fetchCategories({ page: safePage, limit, search }));
      }
    } else {
      addToast(resultAction.payload || "Failed to delete category", "error");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  // const isLastPage = categories.length < limit;
  const totalPages = Math.ceil(total / limit);
  const isLastPage = page >= totalPages;

  const uplift = { y: -2, scale: 1.05 };
  const press = { scale: 0.95 };

  return (
    <div className="h-full w-full p-6 bg-linear-to-br from-green-50 to-green-100 relative">
      {/* Toasts */}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`px-4 py-2 rounded-lg shadow-md text-white font-medium ${
                t.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Categories Dashboard
      </h1>

      {/* {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )} */}

      {/* Create */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-center">
        <motion.input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="flex-1 max-w-md border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
          animate={
            successFlash ? { backgroundColor: ["#d1fae5", "#ffffff"] } : {}
          }
          transition={{ duration: 0.5 }}
        />
        <motion.button
          whileHover={name.trim() && !loading ? { y: -2, scale: 1.05 } : {}}
          whileTap={name.trim() && !loading ? { scale: 0.95 } : {}}
          disabled={loading || !name.trim()}
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Category
        </motion.button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories..."
        className="w-full max-w-md mx-auto block border-2 border-green-400 rounded-xl p-3 mb-8 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
      />

      {/* List */}
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {categories.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-between items-center bg-white border border-green-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <span className="text-gray-800 font-medium text-lg">
                {c.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteClick(c._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-sm"
              >
                Delete
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div> */}

      {/* Category + SubCategory Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-100 text-left">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">SubCategories</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {categories.map((cat) => (
                <CategoryRow
                  key={cat._id}
                  category={cat}
                  onDelete={handleDeleteClick}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-3 flex-wrap">
        {/* Prev */}
        <motion.button
          whileHover={page > 1 ? uplift : undefined}
          whileTap={page > 1 ? press : undefined}
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-green-500 text-white rounded-full
               shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </motion.button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <motion.button
            key={p}
            onClick={() => setPage(p)}
            whileHover={page !== p ? uplift : undefined}
            whileTap={press}
            className={`px-4 py-2 rounded-full font-semibold shadow-md transition
        ${
          page === p
            ? "bg-green-700 text-white"
            : "bg-white text-green-700 hover:bg-green-100"
        }`}
          >
            {p}
          </motion.button>
        ))}

        {/* Next */}
        <motion.button
          whileHover={!isLastPage ? uplift : undefined}
          whileTap={!isLastPage ? press : undefined}
          disabled={isLastPage}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded-full
               shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </motion.button>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
