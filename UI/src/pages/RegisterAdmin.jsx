import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin, resetAuthState } from "../app/features/authSlice";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect after successful registration
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetAuthState());
        navigate("/");
      }, 800);
    }
  }, [success, dispatch, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerAdmin({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
        )}

        {success && (
          <p className="bg-green-100 text-green-700 p-2 rounded mb-4">
            Account created! Redirecting...
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded ${
              loading ? "bg-gray-500" : "bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
