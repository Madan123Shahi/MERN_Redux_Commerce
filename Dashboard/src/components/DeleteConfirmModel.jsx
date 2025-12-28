const DeleteConfirmModal = ({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded border-2 border-green-400 bg-gray-200 hover:bg-gray-300 text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
