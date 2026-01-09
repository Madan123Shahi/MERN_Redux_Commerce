import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { loginAdmin } from "../app/features/authSlice";
import { loginAdminSchema } from "../validators/Admin.js";
import { toast } from "react-hot-toast";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [routeError, setRouteError] = useState(
    () => location.state?.error || null,
  );
  const [showPassword, setShowPassword] = useState(false);

  // Clear route state after first render
  useEffect(() => {
    if (location.state?.error) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Live validation
    try {
      await loginAdminSchema.validateAt(name, { ...form, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginAdminSchema.validate(form, { abortEarly: false });
      setFieldErrors({});
      setRouteError(null);

      await dispatch(loginAdmin(form)).unwrap();

      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFieldErrors(errors);
        return;
      }

      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
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

        {routeError && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {routeError}
          </p>
        )}
        {/* {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-base">
            {error}
          </p>
        )} */}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              disabled={loading}
              onChange={handleChange}
              className={`w-full border-2 border-green-300 p-3 rounded-md focus:outline-none ${
                fieldErrors.email
                  ? "border-red-400 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-green-400"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-base mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            {/* <div> */}
            <div className="relative">
              <input
                // type="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                disabled={loading}
                onChange={handleChange}
                className={`w-full border-2 border-green-300 p-3 rounded-md focus:outline-none ${
                  fieldErrors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-green-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-gray-700 "
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
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
                ? "bg-green-400 text-white cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
