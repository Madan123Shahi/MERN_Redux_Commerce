import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("email"); // email | phone
  const [form, setForm] = useState({
    email: "",
    phone: "",
    country: "IN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const payload =
        mode === "email"
          ? { email: form.email }
          : { phone: form.phone, country: form.country };

      await api.post("/auth/forgot-password", payload);

      navigate("/reset-password", {
        state: payload,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {/* Toggle */}
        <div className="flex mb-4">
          <button
            onClick={() => setMode("email")}
            className={`flex-1 py-2 ${
              mode === "email" ? "bg-black text-white" : "border"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setMode("phone")}
            className={`flex-1 py-2 ${
              mode === "phone" ? "bg-black text-white" : "border"
            }`}
          >
            Phone
          </button>
        </div>

        {mode === "email" && (
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}

        {mode === "phone" && (
          <>
            <input
              type="text"
              placeholder="Phone number"
              className="w-full border p-2 mb-3"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country code (IN)"
              className="w-full border p-2 mb-3"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}
