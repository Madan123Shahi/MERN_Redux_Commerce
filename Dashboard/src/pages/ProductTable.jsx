// import { motion, AnimatePresence } from "framer-motion";

// export default function ProductTable({
//   products,
//   toggleStatus,
//   setEditProduct,
//   dispatch,
//   loading,
//   onDelete,
// }) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg">
//       <table className="w-full border-separate border-spacing-y-3">
//         <thead>
//           <tr className="bg-green-600 text-2xl text-white rounded-xl">
//             <th className="p-4 text-left rounded-l-xl">Product</th>
//             <th className="p-4 text-center">Price</th>
//             <th className="p-4 text-center">Stock</th>
//             <th className="p-4 text-center rounded-r-xl">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           <AnimatePresence>
//             {products.map((p, idx) => (
//               <motion.tr
//                 key={p._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2, delay: idx * 0.05 }}
//                 className={`bg-white rounded-xl transition-all duration-150 transform hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
//                   idx % 2 === 0 ? "bg-green-50" : ""
//                 }`}
//               >
//                 <td className="p-4 flex items-start gap-4 relative">
//                   <div className="relative group">
//                     <img
//                       src={p.images?.[0] || "/placeholder-product.png"}
//                       className="w-14 h-14 rounded-xl object-cover shadow-sm cursor-zoom-in"
//                     />

//                     <div className="absolute left-16 top-0 z-50 hidden group-hover:block">
//                       <img
//                         src={p.images?.[0] || "/placeholder-product.png"}
//                         className="w-64 h-64 rounded-xl object-contain bg-white shadow-2xl border"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-col">
//                     <p className="font-semibold text-2xl text-green-900">
//                       {p.title}
//                     </p>
//                     <p className="mt-2 text-lg text-green-800 leading-relaxed max-w-xl">
//                       {p.description}
//                     </p>
//                   </div>
//                 </td>

//                 {/* Price */}
//                 <td className="p-4 text-center text-2xl text-green-700 font-semibold">
//                   ₹{p.price}
//                 </td>
//                 {/* Stock */}
//                 <td className="p-4 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-2xl font-medium ${
//                       p.stock > 10
//                         ? "bg-green-100 text-green-700"
//                         : p.stock > 0
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {p.stock}
//                   </span>
//                 </td>
//                 {/* Status
//                 <td className="p-4 text-center">
//                   <button
//                     onClick={() => toggleStatus(p)}
//                     className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-150 ${
//                       p.status === "published"
//                         ? "bg-green-100 text-green-700 hover:bg-green-200"
//                         : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                     }`}
//                   >
//                     {p.status}
//                   </button>
//                 </td> */}
//                 {/* Actions */}
//                 <td className="p-4 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => setEditProduct(p)}
//                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => onDelete(p._id)}
//                       className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </motion.tr>
//             ))}
//           </AnimatePresence>
//         </tbody>
//       </table>

//       {!loading && products.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//           <div className="text-5xl mb-3">📦</div>
//           <p className="text-lg font-medium text-green-600">
//             No products found
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductTable({
  products,
  toggleStatus,
  setEditProduct,
  dispatch,
  loading,
  onDelete,
}) {
  const [preview, setPreview] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-lg relative">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-green-600 text-2xl text-white">
            <th className="p-4 text-left rounded-l-xl">Product</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Stock</th>
            <th className="p-4 text-center rounded-r-xl">Actions</th>
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {products.map((p, idx) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={`transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 ${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                }`}
              >
                {/* PRODUCT */}
                <td className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <img
                      src={p.images?.[0] || "/placeholder-product.png"}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm cursor-zoom-in"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPreview({
                          src: p.images?.[0] || "/placeholder-product.png",
                          x: rect.right + 12,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setPreview(null)}
                    />

                    {/* Text */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-2xl text-green-900">
                        {p.title}
                      </p>
                      <p className="mt-1 text-lg text-green-800 leading-relaxed max-w-xl">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* PRICE */}
                <td className="p-4 text-center text-2xl text-green-700 font-semibold">
                  ₹{p.price}
                </td>

                {/* STOCK */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-2xl font-medium ${
                      p.stock > 10
                        ? "bg-green-100 text-green-700"
                        : p.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* IMAGE PREVIEW (FIXED, OUTSIDE TABLE) */}
      {preview && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: preview.x, top: preview.y }}
        >
          <img
            src={preview.src}
            className="w-64 h-64 rounded-xl bg-white shadow-2xl border object-contain"
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-lg font-medium text-green-600">
            No products found
          </p>
        </div>
      )}
    </div>
  );
}
