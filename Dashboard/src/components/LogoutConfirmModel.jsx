import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

const LogoutConfirmModal = ({ open, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-full">
                <LogOut size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Logout
              </h2>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You’ll need to sign in again.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 
                           text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg bg-red-500 
                           hover:bg-red-600 text-white font-semibold 
                           shadow-md transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
