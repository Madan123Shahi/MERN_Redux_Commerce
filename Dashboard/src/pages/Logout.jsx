import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../app/features/authSlice";
import LogoutConfirmModal from "../components/LogoutConfirmModel";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirmLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-6 bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <LogoutConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default LogoutButton;
