import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin, resetAuthState } from "../app/features/authSlice";
import { useNavigate } from "react-router-dom";
import { registerAdminSchema } from "../validators/Admin.js";

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ Clear auth errors on mount
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // ✅ Live field validation
  const validateField = async (name, value) => {
    try {
      await registerAdminSchema.validateAt(name, {
        ...form,
        [name]: value,
      });

      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ✅ Submit validation (like login)
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerAdminSchema.validate(form, { abortEarly: false });

      setFieldErrors({});
      dispatch(registerAdmin(form));
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      setFieldErrors(errors);
    }
  };

  // Redirect on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
        navigate("/");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl">
            👤
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Create Admin Account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Register to access the admin dashboard
        </p>

        <div className="w-14 h-1 bg-green-400 rounded-full mx-auto my-5"></div>

        {/* API Error */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">
            Account created! Redirecting...
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              disabled={loading}
              onChange={handleChange}
              className={`w-full border p-3 rounded-md focus:outline-none
                ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-green-400"
                }`}
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-base mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              disabled={loading}
              onChange={handleChange}
              className={`w-full border p-3 rounded-md focus:outline-none
                ${
                  fieldErrors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-green-400"
                }`}
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-base mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold p-3 rounded-md transition-all
              ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 text-gray-900"
              }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-green-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
