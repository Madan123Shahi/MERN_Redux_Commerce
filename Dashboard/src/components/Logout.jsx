import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logoutAdmin, clearAuth } from "../app/features/authSlice";
import LogoutConfirmModal from "./LogoutConfirmModel";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();

      // clear Authorization header
      delete api.defaults.headers.common["Authorization"];

      // clear redux auth
      dispatch(clearAuth());

      navigate("/", { replace: true });
      toast.success("Logout Successfully");
    } catch (err) {
      toast.error("Logout failed:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg 
                   bg-red-500 hover:bg-red-600 text-white 
                   font-semibold shadow-md transition 
                   hover:-translate-y-0.5 "
      >
        <LogOut size={18} />
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
