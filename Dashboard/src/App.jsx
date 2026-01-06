import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { Toaster } from "react-hot-toast";
import HomeBanners from "./pages/HomeBanners";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home-banners" element={<HomeBanners />} />
        </Route>
      </Routes>
    </>
  );
}
