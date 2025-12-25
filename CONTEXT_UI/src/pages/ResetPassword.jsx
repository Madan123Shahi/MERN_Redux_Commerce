import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function ResetPassword() {
  const { state } = useLocation(); // email or phone + country
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        ...state,
        otp,
        newPassword,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="text"
          placeholder="OTP"
          className="w-full border p-2 mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
