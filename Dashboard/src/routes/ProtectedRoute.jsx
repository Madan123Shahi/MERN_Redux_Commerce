import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const location = useLocation();

  const {
    user, // admin object
    accessToken,
    isAuthenticated,
    authChecked,
  } = useSelector((state) => state.auth);

  // ⏳ Wait until auth is checked (refresh / me call)
  if (!authChecked) {
    return null; // or loading spinner
  }

  // 🔐 Not authenticated → redirect to login
  if (!isAuthenticated || !accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ Authenticated → allow access
  return <Outlet />;
}
