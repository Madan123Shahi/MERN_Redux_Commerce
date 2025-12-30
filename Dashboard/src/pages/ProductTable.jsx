import { motion, AnimatePresence } from "framer-motion";

export default function ProductTable({
  products,
  toggleStatus,
  setEditProduct,
  dispatch,
  loading,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-green-600 text-white rounded-xl">
            <th className="p-4 text-left rounded-l-xl">Product</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Stock</th>
            <th className="p-4 text-center">Status</th>
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
                className={`bg-white rounded-xl transition-all duration-150 transform hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                  idx % 2 === 0 ? "bg-green-50" : ""
                }`}
              >
                {/* Product */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={p.images?.[0] || "/placeholder-product.png"}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-green-900">{p.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {p.description}
                    </p>
                  </div>
                </td>

                {/* Price */}
                <td className="p-4 text-center text-green-700 font-semibold">
                  ₹{p.price}
                </td>

                {/* Stock */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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

                {/* Status */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-150 ${
                      p.status === "published"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {p.status}
                  </button>
                </td>

                {/* Actions */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteProduct(p._id))}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
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

      {!loading && products.length === 0 && (
        <p className="text-center py-6 text-gray-500">No products found</p>
      )}
    </div>
  );
}
