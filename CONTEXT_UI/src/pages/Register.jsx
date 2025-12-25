import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("email"); // email | phone
  const [form, setForm] = useState({
    email: "",
    phone: "",
    country: "IN",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const payload =
        mode === "email"
          ? { email: form.email, password: form.password }
          : {
              phone: form.phone,
              country: form.country,
              password: form.password,
            };

      await api.post("/auth/register", payload);

      navigate("/verify-otp", {
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
          Create Account
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

        {/* Email */}
        {mode === "email" && (
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}

        {/* Phone */}
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

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

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
