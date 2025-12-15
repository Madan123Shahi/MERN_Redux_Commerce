import { LoginPage } from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterAdmin";
import Dashboard from "./pages/Dashboard";
import { AdminRoute } from "./components/Protected";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { protectAdmin } from "./app/features/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(protectAdmin());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔐 Protected route */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default App;
