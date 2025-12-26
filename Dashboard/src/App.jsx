import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { protectAdmin } from "./app/features/authSlice";

import { LoginPage } from "./pages/Login";
import DashboardLayout from "./pages/Dashboard";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import ProductPage from "./pages/Product";
import AdminRoute from "./routes/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { authChecked, isAuthenticated } = useSelector((state) => state.auth);

  // Check if admin is already logged in
  useEffect(() => {
    dispatch(protectAdmin());
  }, [dispatch]);

  // Show loader until auth check completes
  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="categories" element={<Category />} />
          <Route path="subcategories" element={<SubCategory />} />
          <Route path="products" element={<ProductPage />} />
          <Route index element={<Navigate to="categories" replace />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default App;
