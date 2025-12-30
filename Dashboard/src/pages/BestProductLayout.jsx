// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from "react-select";

// import {
//   fetchProducts,
//   createProduct,
//   deleteProduct,
//   updateProduct,
//   fetchAllCategories,
//   fetchSubCategories,
// } from "../app/features/productSlice";

// export default function ProductPage() {
//   const dispatch = useDispatch();
//   const { products, categories, subCategories, loading, total } = useSelector(
//     (state) => state.product
//   );

//   /* ---------------- STATE ---------------- */
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     category: "",
//     subCategory: "",
//     status: "draft",
//     images: [],
//   });

//   const [filters, setFilters] = useState({
//     title: "",
//     category: "",
//     subCategory: "",
//     minPrice: "",
//     maxPrice: "",
//   });

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(9);
//   const [selected, setSelected] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [toasts, setToasts] = useState([]);

//   /* ---------------- EFFECTS ---------------- */
//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchSubCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(
//       fetchProducts({
//         page,
//         limit,
//         search,
//         ...filters,
//       })
//     );
//   }, [dispatch, page, search, filters]);

//   /* ---------------- HELPERS ---------------- */
//   const addToast = (message, type = "success") => {
//     const id = Date.now();
//     setToasts((t) => [...t, { id, message, type }]);
//     setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
//   };

//   const handleCreate = async () => {
//     if (!form.title || !form.category || !form.subCategory || !form.price) {
//       return addToast(
//         "Title, category, subcategory, and price required",
//         "error"
//       );
//     }

//     const formData = new FormData();

//     formData.append("title", form.title);
//     formData.append("description", form.description);
//     formData.append("price", form.price);
//     formData.append("discountPrice", form.discountPrice);
//     formData.append("stock", form.stock);
//     formData.append("category", form.category);
//     formData.append("subCategory", form.subCategory);
//     formData.append("status", form.status);

//     for (let file of form.images) {
//       formData.append("images", file);
//     }

//     const result = await dispatch(createProduct(formData));

//     if (createProduct.fulfilled.match(result)) {
//       setForm({
//         title: "",
//         description: "",
//         price: "",
//         discountPrice: "",
//         stock: "",
//         category: "",
//         subCategory: "",
//         status: "draft",
//         images: [],
//       });

//       addToast("Product added successfully");
//     } else {
//       addToast("Failed to add product", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     await dispatch(deleteProduct(id));
//     addToast("Product deleted");
//   };

//   const handleUpdate = async () => {
//     await dispatch(updateProduct(editProduct));
//     addToast("Product updated");
//     setEditProduct(null);
//   };

//   /* ---------------- OPTIONS ---------------- */
//   const categoryOptions = categories.map((c) => ({
//     value: c._id,
//     label: c.name,
//   }));
//   const subCategoryOptions = subCategories.map((s) => ({
//     value: s._id,
//     label: s.name,
//   }));

//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: "3rem",
//       borderRadius: "1rem",
//       border: "2px solid #22c55e",
//       backgroundColor: "white",
//       padding: "0 0.25rem",
//       display: "flex",
//       alignItems: "center",
//       boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
//       "&:hover": { borderColor: "#16a34a" },
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       padding: "0 0.75rem",
//       display: "flex",
//       alignItems: "center",
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       margin: 0,
//       color: "#065f46",
//       display: "flex",
//       alignItems: "center",
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: 0,
//       padding: 0,
//       color: "#065f46",
//     }),
//     placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       color: "#16a34a",
//       padding: "0 0.5rem",
//       "&:hover": { color: "#15803d" },
//     }),
//     clearIndicator: (provided) => ({
//       ...provided,
//       color: "#16a34a",
//       padding: "0 0.5rem",
//       "&:hover": { color: "#15803d" },
//     }),
//     menu: (provided) => ({
//       ...provided,
//       marginTop: "0.5rem",
//       borderRadius: "1rem",
//       overflow: "hidden",
//       boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
//     }),
//     menuList: (provided) => ({
//       ...provided,
//       padding: "0.5rem",
//       maxHeight: "220px",
//       overflowY: "auto",
//       scrollbarWidth: "none",
//       msOverflowStyle: "none",
//       "&::-webkit-scrollbar": { display: "none" },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       cursor: "pointer",
//       padding: "0.75rem 1rem",
//       fontWeight: 500,
//       margin: 0,
//       borderRadius: "0.75rem",
//       backgroundColor: state.isSelected
//         ? "#16a34a"
//         : state.isFocused
//         ? "#22c55e"
//         : "transparent",
//       color: state.isSelected || state.isFocused ? "white" : "#065f46",
//       ":active": { backgroundColor: "#15803d", color: "white" },
//     }),
//     noOptionsMessage: (provided) => ({
//       ...provided,
//       padding: "0.75rem",
//       color: "#6b7280",
//     }),
//   };

//   /* ---------------- ANIMATIONS ---------------- */
//   const uplift = { y: -2, scale: 1.05 };
//   const press = { scale: 0.95 };
//   const totalPages = Math.ceil(total / limit);
//   const isLastPage = page >= totalPages;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* TOASTS */}
//       <div className="fixed top-5 right-5 z-50 space-y-2">
//         <AnimatePresence>
//           {toasts.map((t) => (
//             <motion.div
//               key={t.id}
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 40 }}
//               className={`px-4 py-2 rounded-lg text-white shadow-lg ${
//                 t.type === "success" ? "bg-green-600" : "bg-red-600"
//               }`}
//             >
//               {t.message}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       <h1 className="text-3xl font-bold mb-6 text-center">
//         📦 Product Dashboard
//       </h1>

//       {/* FILTER BAR */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <input
//           type="text"
//           placeholder="Search by title"
//           value={filters.title}
//           onChange={(e) => setFilters((f) => ({ ...f, title: e.target.value }))}
//           className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//         />

//         <input
//           type="number"
//           placeholder="Min ₹"
//           value={filters.minPrice}
//           onChange={(e) =>
//             setFilters((f) => ({ ...f, minPrice: e.target.value }))
//           }
//           className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//         />

//         <input
//           type="number"
//           placeholder="Max ₹"
//           value={filters.maxPrice}
//           onChange={(e) =>
//             setFilters((f) => ({ ...f, maxPrice: e.target.value }))
//           }
//           className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//         />

//         <Select
//           placeholder="Category"
//           options={categoryOptions}
//           isClearable
//           styles={selectStyles}
//           value={
//             categoryOptions.find((c) => c.value === filters.category) || null
//           }
//           onChange={(s) =>
//             setFilters((f) => ({ ...f, category: s?.value || "" }))
//           }
//           className="w-full"
//         />

//         <Select
//           placeholder="SubCategory"
//           options={subCategoryOptions}
//           isClearable
//           styles={selectStyles}
//           value={
//             subCategoryOptions.find((s) => s.value === filters.subCategory) ||
//             null
//           }
//           onChange={(s) =>
//             setFilters((f) => ({ ...f, subCategory: s?.value || "" }))
//           }
//           className="w-full"
//         />

//         <button
//           className="w-full bg-red-500 text-white py-3 rounded-xl mt-2 md:mt-0"
//           onClick={() =>
//             setFilters({
//               title: "",
//               category: "",
//               subCategory: "",
//               minPrice: "",
//               maxPrice: "",
//             })
//           }
//         >
//           Clear
//         </button>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-12 gap-6">
//         {/* CREATE FORM */}
//         <div className="col-span-12 lg:col-span-4">
//           <div className="bg-white p-5 rounded-xl shadow sticky top-6 space-y-3">
//             <h2 className="text-xl font-semibold mb-4">Add Product</h2>

//             <input
//               placeholder="Title"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <textarea
//               placeholder="Description"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <input
//               type="number"
//               placeholder="Price"
//               value={form.price}
//               onChange={(e) => setForm({ ...form, price: e.target.value })}
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <input
//               type="number"
//               placeholder="Discount Price"
//               value={form.discountPrice}
//               onChange={(e) =>
//                 setForm({ ...form, discountPrice: e.target.value })
//               }
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <input
//               type="number"
//               placeholder="Stock"
//               value={form.stock}
//               onChange={(e) => setForm({ ...form, stock: e.target.value })}
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <Select
//               placeholder="Category"
//               options={categoryOptions}
//               isClearable
//               styles={selectStyles}
//               value={
//                 categoryOptions.find((c) => c.value === form.category) || null
//               }
//               onChange={(s) => setForm({ ...form, category: s?.value || "" })}
//               className="w-full"
//             />

//             <Select
//               placeholder="SubCategory"
//               options={subCategoryOptions}
//               isClearable
//               styles={selectStyles}
//               value={
//                 subCategoryOptions.find((s) => s.value === form.subCategory) ||
//                 null
//               }
//               onChange={(s) =>
//                 setForm({ ...form, subCategory: s?.value || "" })
//               }
//               className="w-full"
//             />

//             <input
//               type="file"
//               multiple
//               onChange={(e) =>
//                 setForm({ ...form, images: [...e.target.files] })
//               }
//               className="w-full border-2 border-green-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
//             />

//             <button
//               onClick={handleCreate}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-3 rounded-xl"
//             >
//               Add Product
//             </button>
//           </div>
//         </div>

//         {/* PRODUCT GRID */}
//         <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
//           <AnimatePresence>
//             {products.map((p) => (
//               <motion.div
//                 key={p._id}
//                 whileHover={uplift}
//                 className="bg-white rounded-xl shadow-md overflow-hidden relative"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(p._id)}
//                   onChange={() =>
//                     setSelected((prev) =>
//                       prev.includes(p._id)
//                         ? prev.filter((id) => id !== p._id)
//                         : [...prev, p._id]
//                     )
//                   }
//                   className="absolute top-3 left-3 z-10"
//                 />

//                 {/* Display first image */}
//                 <img src={p.images[0]} className="h-48 w-full object-cover" />

//                 <div className="p-4">
//                   <h3 className="font-semibold truncate">{p.title}</h3>
//                   <p className="text-green-700 font-semibold">₹{p.price}</p>
//                   {p.discountPrice && (
//                     <p className="text-red-500 font-medium line-through">
//                       ₹{p.discountPrice}
//                     </p>
//                   )}

//                   <div className="flex gap-2 flex-wrap text-sm mt-2">
//                     <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
//                       {p.category?.name}
//                     </span>
//                     {p.subCategory && (
//                       <span className="px-3 py-1 rounded-full bg-green-50 text-green-600">
//                         {p.subCategory?.name}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={() => setEditProduct(p)}
//                       className="text-blue-500 text-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(p._id)}
//                       className="text-red-500 text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }

// the above one is good one as well
// This is unique
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from "react-select";

// import {
//   fetchProducts,
//   createProduct,
//   deleteProduct,
//   updateProduct,
//   fetchAllCategories,
//   fetchSubCategories,
// } from "../app/features/productSlice";

// export default function ProductPage() {
//   const dispatch = useDispatch();
//   const { products, categories, subCategories, loading, total } = useSelector(
//     (state) => state.product
//   );

//   /* ---------------- STATE ---------------- */
//   const [showCreate, setShowCreate] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     category: "",
//     subCategory: "",
//     status: "draft",
//     images: [],
//   });

//   const [page, setPage] = useState(1);
//   const [limit] = useState(8);

//   /* ---------------- EFFECTS ---------------- */
//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchSubCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchProducts({ page, limit }));
//   }, [dispatch, page]);

//   /* ---------------- CREATE ---------------- */
//   const handleCreate = async () => {
//     const formData = new FormData();

//     Object.entries(form).forEach(([key, value]) => {
//       if (key === "images") {
//         value.forEach((file) => formData.append("images", file));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     const result = await dispatch(createProduct(formData));

//     if (createProduct.fulfilled.match(result)) {
//       setShowCreate(false);
//       setForm({
//         title: "",
//         description: "",
//         price: "",
//         discountPrice: "",
//         stock: "",
//         category: "",
//         subCategory: "",
//         status: "draft",
//         images: [],
//       });
//     }
//   };

//   /* ---------------- OPTIONS ---------------- */
//   const categoryOptions = categories.map((c) => ({
//     value: c._id,
//     label: c.name,
//   }));

//   const subCategoryOptions = subCategories.map((s) => ({
//     value: s._id,
//     label: s.name,
//   }));

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">📦 Products</h1>
//         <button
//           onClick={() => setShowCreate(true)}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl shadow"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* PRODUCT GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//         {products.map((p) => (
//           <motion.div
//             key={p._id}
//             whileHover={{ y: -3 }}
//             className="bg-white rounded-xl shadow overflow-hidden"
//           >
//             <img src={p.images?.[0]} className="h-52 w-full object-cover" />

//             <div className="p-4">
//               <h3 className="font-semibold truncate">{p.title}</h3>

//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-green-700 font-bold">₹{p.price}</span>
//                 {p.discountPrice && (
//                   <span className="text-red-400 line-through text-sm">
//                     ₹{p.discountPrice}
//                   </span>
//                 )}
//               </div>

//               <div className="flex flex-wrap gap-2 mt-3 text-xs">
//                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
//                   {p.category?.name}
//                 </span>
//                 {p.subCategory && (
//                   <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">
//                     {p.subCategory?.name}
//                   </span>
//                 )}
//               </div>

//               <div className="flex justify-between mt-4 text-sm">
//                 <button className="text-blue-500">Edit</button>
//                 <button
//                   onClick={() => dispatch(deleteProduct(p._id))}
//                   className="text-red-500"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* CREATE PRODUCT SLIDE OVER */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowCreate(false)}
//               className="fixed inset-0 bg-black/40 z-40"
//             />

//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", stiffness: 260, damping: 25 }}
//               className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-6 overflow-y-auto"
//             >
//               <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

//               <div className="space-y-3">
//                 <input
//                   placeholder="Title"
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   className="w-full border p-3 rounded-xl"
//                 />

//                 <textarea
//                   placeholder="Description"
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm({ ...form, description: e.target.value })
//                   }
//                   className="w-full border p-3 rounded-xl"
//                 />

//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     value={form.price}
//                     onChange={(e) =>
//                       setForm({ ...form, price: e.target.value })
//                     }
//                     className="border p-3 rounded-xl"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Discount"
//                     value={form.discountPrice}
//                     onChange={(e) =>
//                       setForm({ ...form, discountPrice: e.target.value })
//                     }
//                     className="border p-3 rounded-xl"
//                   />
//                 </div>

//                 <input
//                   type="number"
//                   placeholder="Stock"
//                   value={form.stock}
//                   onChange={(e) => setForm({ ...form, stock: e.target.value })}
//                   className="w-full border p-3 rounded-xl"
//                 />

//                 <Select
//                   placeholder="Category"
//                   options={categoryOptions}
//                   onChange={(s) =>
//                     setForm({ ...form, category: s?.value || "" })
//                   }
//                 />

//                 <Select
//                   placeholder="SubCategory"
//                   options={subCategoryOptions}
//                   onChange={(s) =>
//                     setForm({ ...form, subCategory: s?.value || "" })
//                   }
//                 />

//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       images: [...e.target.files],
//                     })
//                   }
//                 />

//                 {/* IMAGE PREVIEW */}
//                 <div className="grid grid-cols-3 gap-2">
//                   {form.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={URL.createObjectURL(img)}
//                       className="h-20 w-full object-cover rounded-lg"
//                     />
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleCreate}
//                   disabled={loading}
//                   className="w-full bg-green-600 text-white py-3 rounded-xl mt-4"
//                 >
//                   Create Product
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// Good as well

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from "react-select";

// import {
//   fetchProducts,
//   createProduct,
//   deleteProduct,
//   updateProduct,
//   fetchAllCategories,
//   fetchSubCategories,
// } from "../app/features/productSlice";

// /* ===================== */
// /* COMMON INPUT STYLES */
// /* ===================== */
// const inputBase =
//   "w-full border-2 border-green-400 rounded-xl p-3 " +
//   "focus:outline-none focus:ring-2 focus:ring-green-400 " +
//   "shadow-md bg-white text-green-900 placeholder-gray-400";

// /* ===================== */
// /* SELECT STYLES */
// /* ===================== */
// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     minHeight: "3rem",
//     borderRadius: "1rem",
//     border: "2px solid #22c55e",
//     backgroundColor: "white",
//     padding: "0 0.25rem",
//     boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
//   }),
//   valueContainer: (p) => ({ ...p, padding: "0 0.75rem" }),
//   singleValue: (p) => ({ ...p, color: "#065f46" }),
//   placeholder: (p) => ({ ...p, color: "#9ca3af" }),
//   dropdownIndicator: (p) => ({ ...p, color: "#16a34a" }),
//   clearIndicator: (p) => ({ ...p, color: "#16a34a" }),
//   menu: (p) => ({
//     ...p,
//     marginTop: "0.5rem",
//     borderRadius: "1rem",
//     overflow: "hidden",
//   }),
//   menuList: (p) => ({
//     ...p,
//     maxHeight: "220px",
//     scrollbarWidth: "none",
//     "&::-webkit-scrollbar": { display: "none" },
//   }),
//   option: (p, s) => ({
//     ...p,
//     padding: "0.75rem 1rem",
//     borderRadius: "0.75rem",
//     backgroundColor: s.isSelected
//       ? "#16a34a"
//       : s.isFocused
//       ? "#22c55e"
//       : "transparent",
//     color: s.isSelected || s.isFocused ? "white" : "#065f46",
//   }),
// };

// export default function ProductPage() {
//   const dispatch = useDispatch();
//   const { products, categories, subCategories, loading, total } = useSelector(
//     (state) => state.product
//   );

//   /* ===================== */
//   /* STATE */
//   /* ===================== */
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     category: "",
//     subCategory: "",
//     status: "draft",
//     images: [],
//   });

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 9;

//   /* ===================== */
//   /* EFFECTS */
//   /* ===================== */
//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchSubCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchProducts({ page, limit, search }));
//   }, [dispatch, page, search]);

//   /* ===================== */
//   /* HANDLERS */
//   /* ===================== */
//   const handleCreate = async () => {
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (key === "images") {
//         value.forEach((img) => formData.append("images", img));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     await dispatch(createProduct(formData));
//     setForm({
//       title: "",
//       description: "",
//       price: "",
//       discountPrice: "",
//       stock: "",
//       category: "",
//       subCategory: "",
//       status: "draft",
//       images: [],
//     });
//   };

//   /* ===================== */
//   /* OPTIONS */
//   /* ===================== */
//   const categoryOptions = categories.map((c) => ({
//     value: c._id,
//     label: c.name,
//   }));

//   const subCategoryOptions = subCategories.map((s) => ({
//     value: s._id,
//     label: s.name,
//   }));

//   /* ===================== */
//   /* RENDER */
//   /* ===================== */
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-8">
//         📦 Product Management
//       </h1>

//       {/* SEARCH */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search products..."
//         className={`${inputBase} max-w-md mx-auto block mb-8`}
//       />

//       <div className="grid grid-cols-12 gap-6">
//         {/* ===================== */}
//         {/* ADD PRODUCT FORM */}
//         {/* ===================== */}
//         <div className="col-span-12 lg:col-span-4">
//           <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 sticky top-6">
//             <h2 className="text-xl font-semibold">Add Product</h2>

//             <input
//               placeholder="Product title"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               className={inputBase}
//             />

//             <textarea
//               placeholder="Description"
//               rows={4}
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className={`${inputBase} resize-none`}
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 className={inputBase}
//               />
//               <input
//                 type="number"
//                 placeholder="Discount"
//                 value={form.discountPrice}
//                 onChange={(e) =>
//                   setForm({ ...form, discountPrice: e.target.value })
//                 }
//                 className={inputBase}
//               />
//             </div>

//             <input
//               type="number"
//               placeholder="Stock"
//               value={form.stock}
//               onChange={(e) => setForm({ ...form, stock: e.target.value })}
//               className={inputBase}
//             />

//             <Select
//               placeholder="Category"
//               options={categoryOptions}
//               styles={selectStyles}
//               isClearable
//               value={
//                 categoryOptions.find((c) => c.value === form.category) || null
//               }
//               onChange={(s) => setForm({ ...form, category: s?.value || "" })}
//             />

//             <Select
//               placeholder="SubCategory"
//               options={subCategoryOptions}
//               styles={selectStyles}
//               isClearable
//               value={
//                 subCategoryOptions.find((s) => s.value === form.subCategory) ||
//                 null
//               }
//               onChange={(s) =>
//                 setForm({ ...form, subCategory: s?.value || "" })
//               }
//             />

//             <input
//               type="file"
//               multiple
//               onChange={(e) =>
//                 setForm({ ...form, images: [...e.target.files] })
//               }
//               className={`${inputBase} file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0
//               file:bg-green-100 file:text-green-700
//               hover:file:bg-green-200 cursor-pointer`}
//             />

//             <button
//               onClick={handleCreate}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
//             >
//               Add Product
//             </button>
//           </div>
//         </div>

//         {/* ===================== */}
//         {/* PRODUCT GRID */}
//         {/* ===================== */}
//         <div className="col-span-12 lg:col-span-8 grid sm:grid-cols-2 gap-6">
//           <AnimatePresence>
//             {products.map((p) => (
//               <motion.div
//                 key={p._id}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white rounded-xl shadow overflow-hidden"
//               >
//                 <img
//                   src={p.images?.[0]}
//                   alt={p.title}
//                   className="h-48 w-full object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="font-semibold truncate">{p.title}</h3>
//                   <p className="text-green-700 font-semibold">₹{p.price}</p>
//                   <div className="flex gap-2 mt-2 text-sm">
//                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
//                       {p.category?.name}
//                     </span>
//                     {p.subCategory && (
//                       <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">
//                         {p.subCategory?.name}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }

//  Best One for to represent Product as Card

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from "react-select";

// import {
//   fetchProducts,
//   createProduct,
//   deleteProduct,
//   fetchAllCategories,
//   fetchSubCategories,
//   fetchSubCategoriesByCategory,
// } from "../app/features/productSlice";

// /* ================= COMMON STYLES ================= */
// const inputBase =
//   "w-full border-2 border-green-400 rounded-xl p-3 " +
//   "focus:outline-none focus:ring-2 focus:ring-green-400 " +
//   "shadow-md bg-white text-green-900 placeholder-gray-400";

// /* ================= SELECT STYLES ================= */
// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     minHeight: "3rem",
//     borderRadius: "1rem",
//     border: "2px solid #22c55e",
//     boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
//   }),
//   option: (p, s) => ({
//     ...p,
//     backgroundColor: s.isSelected
//       ? "#16a34a"
//       : s.isFocused
//       ? "#22c55e"
//       : "white",
//     color: s.isSelected || s.isFocused ? "white" : "#065f46",
//   }),
// };

// /* ================= IMAGE CAROUSEL ================= */
// function Carousel({ images }) {
//   const [index, setIndex] = useState(0);

//   if (!images?.length) {
//     return (
//       <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-400">
//         No Image
//       </div>
//     );
//   }

//   const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
//   const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

//   return (
//     <div className="relative h-64 overflow-hidden">
//       <AnimatePresence mode="wait">
//         <motion.img
//           key={images[index]}
//           src={images[index]}
//           className="w-full h-full object-cover"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         />
//       </AnimatePresence>

//       {/* LEFT ARROW */}
//       <button
//         onClick={prev}
//         className="absolute top-1/2 left-3 -translate-y-1/2
//         bg-green-600 hover:bg-green-700 text-white
//         rounded-full p-3 shadow-lg transition transform hover:scale-110"
//       >
//         <svg
//           className="w-5 h-5"
//           fill="none"
//           stroke="white"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>

//       {/* RIGHT ARROW */}
//       <button
//         onClick={next}
//         className="absolute top-1/2 right-3 -translate-y-1/2
//         bg-green-600 hover:bg-green-700 text-white
//         rounded-full p-3 shadow-lg transition transform hover:scale-110"
//       >
//         <svg
//           className="w-5 h-5"
//           fill="none"
//           stroke="white"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//         </svg>
//       </button>
//     </div>
//   );
// }

// /* ================= MAIN PAGE ================= */
// export default function ProductPage() {
//   const dispatch = useDispatch();
//   const { products, categories, subCategories, loading } = useSelector(
//     (state) => state.product
//   );

//   const [showCreate, setShowCreate] = useState(false);
//   const [page] = useState(1);
//   const limit = 8;

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     category: "",
//     subCategory: "",
//     images: [],
//   });

//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchSubCategories());
//     dispatch(fetchProducts({ page, limit }));
//   }, [dispatch, page]);

//   const handleCategoryChange = (selected) => {
//     const categoryId = selected?.value || "";
//     setForm({ ...form, category: categoryId, subCategory: "" });

//     if (categoryId) {
//       dispatch(fetchSubCategoriesByCategory(categoryId));
//     }
//   };

//   const handleCreate = async () => {
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => {
//       if (k === "images") v.forEach((f) => fd.append("images", f));
//       else fd.append(k, v);
//     });

//     const res = await dispatch(createProduct(fd));
//     if (createProduct.fulfilled.match(res)) {
//       setShowCreate(false);
//       dispatch(fetchProducts({ page, limit }));
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-bold">📦 Products</h1>
//         <button
//           onClick={() => setShowCreate(true)}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* PRODUCTS GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {products.map((p) => (
//           <motion.div
//             key={p._id}
//             whileHover={{ scale: 1.03 }}
//             className="bg-white rounded-2xl shadow overflow-hidden"
//           >
//             <Carousel images={p.images} />

//             <div className="p-5 space-y-3">
//               <h3 className="font-semibold text-lg">{p.title}</h3>

//               <p className="text-gray-600 text-sm line-clamp-3">
//                 {p.description}
//               </p>

//               <div className="text-sm text-gray-500">
//                 {p.category?.name} → {p.subCategory?.name}
//               </div>

//               <div className="flex items-center gap-3">
//                 <span className="text-green-700 font-bold text-xl">
//                   ₹{p.price}
//                 </span>
//                 {p.discountPrice && (
//                   <span className="line-through text-red-400">
//                     ₹{p.discountPrice}
//                   </span>
//                 )}
//               </div>

//               <div className="flex justify-between pt-4 border-t">
//                 <button
//                   className="bg-green-600 hover:bg-green-700
//                   text-white px-4 py-2 rounded-xl shadow"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => dispatch(deleteProduct(p._id))}
//                   className="bg-red-600 hover:bg-red-700
//                   text-white px-4 py-2 rounded-xl shadow"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* CREATE PANEL */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div
//               onClick={() => setShowCreate(false)}
//               className="fixed inset-0 bg-black/40 z-40"
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               className="fixed right-0 top-0 w-full sm:w-[420px]
//               bg-white h-full z-50 p-6 overflow-y-auto"
//             >
//               <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

//               <div className="space-y-3">
//                 <input
//                   className={inputBase}
//                   placeholder="Title"
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                 />

//                 <textarea
//                   className={inputBase}
//                   placeholder="Description"
//                   rows={4}
//                   onChange={(e) =>
//                     setForm({ ...form, description: e.target.value })
//                   }
//                 />

//                 <Select
//                   placeholder="Category"
//                   styles={selectStyles}
//                   options={categories.map((c) => ({
//                     value: c._id,
//                     label: c.name,
//                   }))}
//                   onChange={handleCategoryChange}
//                 />

//                 <Select
//                   placeholder="SubCategory"
//                   styles={selectStyles}
//                   options={subCategories.map((s) => ({
//                     value: s._id,
//                     label: s.name,
//                   }))}
//                   onChange={(s) => setForm({ ...form, subCategory: s?.value })}
//                 />

//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) =>
//                     setForm({ ...form, images: [...e.target.files] })
//                   }
//                 />

//                 <button
//                   onClick={handleCreate}
//                   disabled={loading}
//                   className="w-full bg-green-600 hover:bg-green-700
//                   text-white py-3 rounded-xl font-semibold"
//                 >
//                   Create Product
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
