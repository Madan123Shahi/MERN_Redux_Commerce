// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./Pages/AdminDashboard";
import ProductsPage from "./Pages/Products";
import CategoriesPage from "./Pages/Categories";
import SubCategoriesPage from "./Pages/SubCategories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/admin/subcategories" element={<SubCategoriesPage />} />

      {/* 404 Page */}
      <Route path="*" element={<div className="p-6">Page Not Found</div>} />
    </Routes>
  );
}

export default App;
