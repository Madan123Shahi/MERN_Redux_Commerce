import { motion } from "framer-motion";
import { useState } from "react";

export default function CategoryRow({ category, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CATEGORY ROW */}
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-b hover:bg-green-50"
      >
        <td className="p-4 font-semibold text-gray-800">{category.name}</td>

        <td className="p-4 text-gray-600">
          {category.subCategories?.length || 0}
        </td>

        <td className="p-4 text-center flex gap-2 justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
          >
            {open ? "Hide" : "View"}
          </button>

          <button
            onClick={() => onDelete(category._id)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
          >
            Delete
          </button>
        </td>
      </motion.tr>

      {/* SUBCATEGORY ROW */}
      {open && (
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-green-50"
        >
          <td colSpan={3} className="p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.subCategories?.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white border rounded-lg p-3 flex justify-between items-center shadow-sm"
                >
                  <span>{sub.name}</span>
                  <button className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
            </div>
          </td>
        </motion.tr>
      )}
    </>
  );
}
