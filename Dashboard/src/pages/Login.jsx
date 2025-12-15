import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, resetAuthState } from "../app/features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdminSchema } from "../validators/Admin.js";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, success } = useSelector((state) => state.auth);

  // Store route error locally (ONE TIME)
  const [routeError, setRouteError] = useState(
    () => location.state?.error || null
  );

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ Clear auth errors on mount
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // 🔥 Clear route state AFTER first render
  useEffect(() => {
    if (location.state?.error) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  // Redirect on login success
  useEffect(() => {
    if (success) {
      navigate("/dashboard");
      dispatch(resetAuthState());
    }
  }, [success, dispatch, navigate]);

  // ✅ Live field validation
  const validateField = async (name, value) => {
    if (!value) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      }));
      return;
    }

    try {
      await loginAdminSchema.validateAt(name, { ...form, [name]: value });
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginAdminSchema.validate(form, { abortEarly: false });
      setFieldErrors({});
      setRouteError(null);
      dispatch(resetAuthState());
      dispatch(loginAdmin(form));
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      setFieldErrors(errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl">
            🔐
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Admin Login
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Sign in to manage your dashboard
        </p>

        <div className="w-14 h-1 bg-green-400 rounded-full mx-auto my-5"></div>

        {/* 🚫 AdminRoute error */}
        {routeError && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {routeError}
          </p>
        )}

        {/* ❌ API error */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              disabled={loading}
              onChange={handleChange}
              className={`w-full border p-3 rounded-md focus:outline-none ${
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
              className={`w-full border p-3 rounded-md focus:outline-none ${
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
            className={`w-full font-semibold p-3 rounded-md transition-all ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-gray-900"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-600 font-medium hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
