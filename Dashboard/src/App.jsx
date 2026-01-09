import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/Login";
import { Toaster } from "react-hot-toast";
import HomeBanners from "./pages/HomeBanners";
import DashboardHome from "./pages/Dashboard"; // create this
import DashboardLayout from "./components/DashboardLayout";
import ProductPage from "./pages/Product";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* 🔥 Dashboard Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Right-side pages */}
            <Route index element={<DashboardHome />} />
            <Route path="home-banners" element={<HomeBanners />} />
            <Route path="products" element={<ProductPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
