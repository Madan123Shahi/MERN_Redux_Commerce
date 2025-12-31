import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

import {
  fetchProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  fetchAllCategories,
  fetchSubCategoriesByCategory,
} from "../app/features/productSlice";
import DeleteConfirmModal from "../components/DeleteConfirmModel";
import ProductTable from "./ProductTable";

/* ================= STYLES ================= */
const input =
  "w-full border-2 border-green-400 rounded-xl px-4 py-3 " +
  "bg-white text-green-900 placeholder-gray-400 " +
  "outline-none transition shadow-sm " +
  "focus:outline-none focus:ring-5 focus:ring-green-300 focus:border-green-600 " +
  "hover:border-green-600" +
  "disabled:hover:border-green-500" +
  " disabled:hover:ring-0" +
  " disabled:text-gray-400";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "3.25rem",
    borderRadius: "0.75rem",
    border: "2px solid #22c55e",
    backgroundColor: "white",
    padding: "0 0.25rem",
    boxShadow: state.isFocused
      ? "0 0 0 5px #86efac"
      : "0 1px 2px rgba(0,0,0,0.05)",
    transition: "all 0.15s ease",
    outline: "none",
    borderColor: state.isFocused ? "#16a34a" : "#22c55e",
    "&:hover": {
      borderColor: "#16a34a",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 1rem" }),
  singleValue: (base, state) => ({
    ...base,
    color: state.isDisabled ? "#9ca3af" : "#065f46",
  }),
  input: (base, state) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#065f46",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#9ca3af",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#16a34a",
    "&:hover": { color: "#15803d" },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#16a34a",
    "&:hover": { color: "#15803d" },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "0.5rem",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0.5rem",
    maxHeight: "220px",
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  }),
  option: (provided, state) => ({
    ...provided,
    margin: 0,
    borderRadius: "0.75rem",
    backgroundColor: state.isSelected
      ? "#16a34a"
      : state.isFocused
      ? "#22c55e"
      : "transparent",
    color: state.isSelected || state.isFocused ? "white" : "#065f46",
    cursor: "pointer",
    boxShadow: "none",
    ":active": { backgroundColor: "#15803d", color: "white" },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    padding: "0.75rem",
    color: "#6b7280",
  }),
};

export default function ProductPage() {
  const dispatch = useDispatch();
  const { products, total, categories, loading, subCategories } = useSelector(
    (s) => s.product
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editProduct, setEditProduct] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    subCategory: "",
    images: [],
  });

  const handleCreate = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "images") v.forEach((file) => fd.append("images", file));
      else fd.append(k, v);
    });

    const res = await dispatch(createProduct(fd));
    if (createProduct.fulfilled.match(res)) {
      setShowCreate(false);
      dispatch(fetchProducts({ page, limit, search }));
      setForm({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: "",
        subCategory: "",
        images: [],
      });
    }
  };

  const sortOptions = [
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "stock", label: "Stock: High → Low" },
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search }));
    dispatch(fetchAllCategories());
  }, [dispatch, page, search]);

  /* ================= HANDLE PAGE RESET ================= */
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (categoryFilter)
      data = data.filter((p) => p.category?._id === categoryFilter);
    if (sort === "price-asc") data.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") data.sort((a, b) => b.price - a.price);
    if (sort === "stock") data.sort((a, b) => b.stock - a.stock);
    return data;
  }, [products, categoryFilter, sort]);

  const toggleStatus = (p) => {
    dispatch(
      updateProduct({
        id: p._id,
        data: { status: p.status === "draft" ? "published" : "draft" },
      })
    );
  };

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const openDeleteModal = (id) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await dispatch(deleteProduct(deleteId));
    if (deleteProduct.fulfilled.match(res)) {
      dispatch(fetchProducts({ page, limit, search }));
      closeDeleteModal();
    }
    setDeleteLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Products</h1>
      {/* SEARCH + FILTER */}
      <div className="bg-white  p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-6">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          // className={input}
          className={`${input} ${
            products.length === 0 ? "cursor-not-allowed" : "cursor-text"
          }`}
          disabled={products.length === 0} // Disable if no products
        />
        <div
          className={
            products.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
          }
        >
          <Select
            styles={selectStyles}
            options={categoryOptions}
            placeholder="Filter by category"
            isClearable
            value={categoryOptions.find((opt) => opt.value === categoryFilter)}
            onChange={(selected) =>
              setCategoryFilter(selected ? selected.value : "")
            }
            isDisabled={products.length === 0} // Disable if no products
          />
        </div>
        <div
          className={
            products.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
          }
        >
          <Select
            styles={selectStyles}
            options={sortOptions}
            placeholder="Sort products"
            isSearchable={false}
            value={sortOptions.find((opt) => opt.value === sort)}
            onChange={(selected) => setSort(selected?.value || "")}
            isDisabled={products.length === 0} // Disable if no products
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📦 Products</h1>
        <button
          onClick={() => setShowCreate(true)}
          className={`bg-green-600 text-white px-6 py-3 rounded-xl shadow 
      transform transition-all duration-150
      hover:-translate-y-1 hover:shadow-lg
      active:translate-y-0 active:shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
        >
          + Add Product
        </button>
      </div>
      {/* TABLE OR EMPTY STATE */}
      {filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          toggleStatus={toggleStatus}
          setEditProduct={setEditProduct}
          onDelete={openDeleteModal}
          dispatch={dispatch}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-gray-600 mb-2">
            😕 No products found
          </p>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
      {/* PAGINATION */}
      {total > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 bg-white rounded shadow">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreate && (
          <>
            {/* BACKDROP */}
            <motion.div
              onClick={() => setShowCreate(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 w-full sm:w-[420px] bg-white h-full z-50 p-6 overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

              <div className="space-y-3">
                {/* Title */}
                <input
                  className={input}
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                {/* Description */}
                <textarea
                  className={input}
                  placeholder="Description"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                {/* Price */}
                <input
                  type="number"
                  className={input}
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                {/* Discount Price */}
                <input
                  type="number"
                  className={input}
                  placeholder="Discount Price (optional)"
                  value={form.discountPrice}
                  onChange={(e) =>
                    setForm({ ...form, discountPrice: e.target.value })
                  }
                />

                {/* Stock */}
                <input
                  type="number"
                  className={input}
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />

                {/* Category */}
                <Select
                  placeholder="Category"
                  styles={selectStyles}
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.name,
                  }))}
                  value={
                    categories
                      .map((c) => ({ value: c._id, label: c.name }))
                      .find((o) => o.value === form.category) || null
                  }
                  onChange={(selected) => {
                    const categoryId = selected?.value || "";
                    setForm({ ...form, category: categoryId, subCategory: "" });
                    if (categoryId)
                      dispatch(fetchSubCategoriesByCategory(categoryId));
                  }}
                />

                <div
                  className={
                    products.length === 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                >
                  {/* SubCategory */}
                  <Select
                    placeholder="SubCategory"
                    styles={selectStyles}
                    options={subCategories.map((s) => ({
                      value: s._id,
                      label: s.name,
                    }))}
                    value={
                      subCategories
                        .map((s) => ({ value: s._id, label: s.name }))
                        .find((o) => o.value === form.subCategory) || null
                    }
                    onChange={(selected) => {
                      const subCategoryId = selected?.value || "";
                      setForm({ ...form, subCategory: subCategoryId });
                    }}
                    isDisabled={!form.category}
                  />
                </div>
                {/* Images */}
                <div className="space-y-1">
                  <label className="flex items-center gap-4 px-4 py-3 border-2 border-green-500 rounded-xl cursor-pointer hover:bg-green-50">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                      Choose files
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {form.images.length > 0
                        ? `${form.images.length} file(s) selected`
                        : "No file chosen"}
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        setForm({ ...form, images: Array.from(e.target.files) })
                      }
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                >
                  Create Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* EDIT MODAL */}
      <AnimatePresence>
        {editProduct && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setEditProduct(null)}
            />

            {/* PANEL */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto bg-white rounded-xl shadow-xl p-6 z-50 w-[90%] max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
              <input
                className={input}
                value={editProduct.title}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, title: e.target.value })
                }
              />
              <input
                className={input}
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
              <input
                className={input}
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    dispatch(
                      updateProduct({ id: editProduct._id, data: editProduct })
                    );
                    setEditProduct(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="This action cannot be undone. Are you sure?"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
