import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const { state } = useLocation(); // email/phone + password
  const navigate = useNavigate();
  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        ...state,
        otp,
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify & Register"}
        </button>
      </div>
    </div>
  );
}
