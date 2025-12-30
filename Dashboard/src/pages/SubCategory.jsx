import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import {
  fetchSubCategories,
  createSubCategory,
  deleteSubCategory,
} from "../app/features/subCategorySlice";
import { fetchAllCategories } from "../app/features/categorySlice";
import DeleteConfirmModal from "../components/DeleteConfirmModel";

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "2px solid #22c55e",
    borderRadius: "1rem",
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
    "&:hover": { borderColor: "#22c55e" },
    minHeight: "3rem",
  }),
  valueContainer: (provided) => ({ ...provided, padding: "0 0.75rem" }),
  input: (provided) => ({ ...provided, margin: 0, padding: 0 }),
  placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
  dropdownIndicator: (provided) => ({ ...provided, padding: "0 0.5rem" }),
  clearIndicator: (provided) => ({ ...provided, padding: "0 0.5rem" }),
};

export default function SubCategory() {
  const dispatch = useDispatch();
  const { subCategories, loading } = useSelector((state) => state.subCategory);
  const { categories } = useSelector((state) => state.category);

  const [form, setForm] = useState({ name: "", category: "" });
  const [toasts, setToasts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const uplift = { y: -2, scale: 1.05 };
  const press = { scale: 0.95 };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const categoryOptions = categories?.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000
    );
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.category) return;

    const result = await dispatch(createSubCategory(form));

    if (createSubCategory.fulfilled.match(result)) {
      setForm({ name: "", category: "" });
      addToast("SubCategory added successfully!");
    } else {
      addToast(result.payload || "Failed to add subcategory", "error");
    }
  };

  const handleConfirmDelete = async () => {
    const result = await dispatch(deleteSubCategory(deleteId));
    setIsDeleteOpen(false);
    setDeleteId(null);

    if (deleteSubCategory.fulfilled.match(result)) {
      addToast("SubCategory deleted!");
    } else {
      addToast(result.payload || "Delete failed", "error");
    }
  };

  const groupedSubCategories = subCategories.reduce((acc, sub) => {
    const categoryName = sub.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(sub);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-linear-to-br from-green-50 to-green-100 min-h-screen">
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

      <h1 className="text-4xl font-bold text-center mb-8">
        SubCategory Dashboard
      </h1>

      {/* ADD SUBCATEGORY */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="SubCategory name"
          className="border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-xl p-3 w-64 min-w-[16rem] max-w-[16rem]"
        />

        <Select
          options={categoryOptions}
          value={
            categoryOptions?.find((opt) => opt.value === form.category) || null
          }
          onChange={(selected) =>
            setForm({ ...form, category: selected ? selected.value : "" })
          }
          placeholder="Select Category"
          isClearable
          isSearchable
          styles={selectStyles}
          className="w-64 min-w-[16rem] max-w-[16rem]"
        />

        <motion.button
          whileHover={
            !loading && form.name.trim() && form.category ? uplift : {}
          }
          whileTap={!loading && form.name.trim() && form.category ? press : {}}
          disabled={loading || !form.name.trim() || !form.category}
          onClick={handleCreate}
          className={`px-6 py-3 rounded-xl text-white ${
            loading || !form.name.trim() || !form.category
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } w-64 min-w-[16rem] max-w-[16rem]`}
        >
          Add SubCategory
        </motion.button>
      </div>

      {/* LIST - GROUPED BY CATEGORY */}
      <div className="space-y-8">
        {Object.entries(groupedSubCategories).map(([categoryName, subs]) => (
          <div key={categoryName}>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              {categoryName}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {subs.map((s) => (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    whileHover={uplift}
                    whileTap={press}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white p-5 rounded-2xl shadow-md flex justify-between items-center hover:shadow-xl"
                  >
                    <span className="text-gray-800 font-medium text-lg">
                      {s.name}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDeleteId(s._id);
                        setIsDeleteOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete SubCategory"
        message="Are you sure?"
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from "react-select";
// import {
//   fetchSubCategories,
//   createSubCategory,
//   deleteSubCategory,
// } from "../app/features/subCategorySlice";
// import { fetchAllCategories } from "../app/features/categorySlice";
// import DeleteConfirmModal from "../components/DeleteConfirmModel";

// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     border: "2px solid #22c55e",
//     borderRadius: "1rem",
//     padding: "0.25rem",
//     boxShadow: state.isFocused ? "0 0 0 2px #86efac" : "none",
//     "&:hover": { borderColor: "#22c55e" },
//     minHeight: "3rem",
//   }),
//   valueContainer: (provided) => ({ ...provided, padding: "0 0.75rem" }),
//   input: (provided) => ({ ...provided, margin: 0, padding: 0 }),
//   placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
//   dropdownIndicator: (provided) => ({ ...provided, padding: "0 0.5rem" }),
//   clearIndicator: (provided) => ({ ...provided, padding: "0 0.5rem" }),
// };

// export default function SubCategory() {
//   const dispatch = useDispatch();

//   const { subCategories, loading } = useSelector((state) => state.subCategory);
//   const { categories } = useSelector((state) => state.category);

//   const [form, setForm] = useState({ name: "", category: "" });
//   const [toasts, setToasts] = useState([]);
//   const [deleteId, setDeleteId] = useState(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllCategories());
//   }, [dispatch]);

//   const categoryOptions = categories?.map((c) => ({
//     value: c._id,
//     label: c.name,
//   }));

//   useEffect(() => {
//     dispatch(fetchSubCategories());
//   }, [dispatch]);

//   const addToast = (message, type = "success") => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(
//       () => setToasts((prev) => prev.filter((t) => t.id !== id)),
//       3000
//     );
//   };

//   const handleCreate = async () => {
//     if (!form.name.trim() || !form.category) return;

//     const result = await dispatch(createSubCategory(form));

//     if (createSubCategory.fulfilled.match(result)) {
//       setForm({ name: "", category: "" });
//       addToast("SubCategory added successfully!");
//     } else {
//       addToast(result.payload || "Failed to add subcategory", "error");
//     }
//   };

//   const handleConfirmDelete = async () => {
//     const result = await dispatch(deleteSubCategory(deleteId));
//     setIsDeleteOpen(false);
//     setDeleteId(null);

//     if (deleteSubCategory.fulfilled.match(result)) {
//       addToast("SubCategory deleted!");
//     } else {
//       addToast(result.payload || "Delete failed", "error");
//     }
//   };

//   const groupedSubCategories = subCategories.reduce((acc, sub) => {
//     const categoryName = sub.category?.name || "Uncategorized";
//     if (!acc[categoryName]) acc[categoryName] = [];
//     acc[categoryName].push(sub);
//     return acc;
//   }, {});

//   return (
//     <div className="p-6 bg-linear-to-br from-green-50 to-green-100 min-h-screen">
//       {/* Toasts */}
//       <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
//         <AnimatePresence>
//           {toasts.map((t) => (
//             <motion.div
//               key={t.id}
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 40 }}
//               className={`px-4 py-2 rounded-lg text-white shadow-md ${
//                 t.type === "success" ? "bg-green-500" : "bg-red-500"
//               }`}
//             >
//               {t.message}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">
//         SubCategory Dashboard
//       </h1>

//       {/* ADD SUBCATEGORY */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
//         <input
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           placeholder="SubCategory name"
//           className="border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-xl p-3 w-64 min-w-[16rem] max-w-[16rem]"
//         />

//         <Select
//           options={categoryOptions}
//           value={
//             categoryOptions?.find((opt) => opt.value === form.category) || null
//           }
//           onChange={(selected) =>
//             setForm({ ...form, category: selected ? selected.value : "" })
//           }
//           placeholder="Select Category"
//           isClearable
//           isSearchable
//           styles={selectStyles}
//           className="w-64 min-w-[16rem] max-w-[16rem]"
//         />

//         <motion.button
//           whileHover={
//             !loading && form.name.trim() && form.category
//               ? { y: -2, scale: 1.05 }
//               : {}
//           }
//           whileTap={
//             !loading && form.name.trim() && form.category ? { scale: 0.95 } : {}
//           }
//           disabled={loading || !form.name.trim() || !form.category}
//           onClick={handleCreate}
//           className={`px-6 py-3 rounded-xl text-white ${
//             loading || !form.name.trim() || !form.category
//               ? "bg-green-300 cursor-not-allowed"
//               : "bg-green-500 hover:bg-green-600"
//           } w-64 min-w-[16rem] max-w-[16rem]`}
//         >
//           Add SubCategory
//         </motion.button>
//       </div>

//       {/* LIST - GROUPED BY CATEGORY */}
//       <div className="space-y-8">
//         {Object.entries(groupedSubCategories).map(([categoryName, subs]) => (
//           <div key={categoryName}>
//             <h2 className="text-xl font-bold text-green-700 mb-4">
//               {categoryName}
//             </h2>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <AnimatePresence>
//                 {subs.map((s) => (
//                   <motion.div
//                     key={s._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     whileHover={{ y: -2, scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="bg-white p-5 rounded-2xl shadow-md flex justify-between items-center"
//                   >
//                     <p className="font-semibold">{s.name}</p>

//                     <button
//                       onClick={() => {
//                         setDeleteId(s._id);
//                         setIsDeleteOpen(true);
//                       }}
//                       className="bg-red-500 text-white px-3 py-1 rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* DELETE MODAL */}
//       <DeleteConfirmModal
//         isOpen={isDeleteOpen}
//         title="Delete SubCategory"
//         message="Are you sure?"
//         onCancel={() => setIsDeleteOpen(false)}
//         onConfirm={handleConfirmDelete}
//         loading={loading}
//       />
//     </div>
//   );
// }
