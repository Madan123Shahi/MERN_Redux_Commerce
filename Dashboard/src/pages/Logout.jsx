import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, clearAuth } from "../app/features/authSlice";
import LogoutConfirmModal from "../components/LogoutConfirmModel";
import api from "../api/axios";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      // 🔥 clear Authorization header
      delete api.defaults.headers.common["Authorization"];

      // 🔥 force-clear redux auth
      dispatch(clearAuth());

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
