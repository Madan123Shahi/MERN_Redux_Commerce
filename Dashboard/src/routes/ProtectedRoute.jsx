import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) return null; // or spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
