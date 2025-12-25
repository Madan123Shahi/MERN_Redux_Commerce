const LogoutConfirmModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-white"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-gray-100 rounded border"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
