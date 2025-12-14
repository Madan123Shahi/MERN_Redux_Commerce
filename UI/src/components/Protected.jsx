import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null; // or <Spinner />

  if (!user || user.role !== "admin") {
    return (
      <Navigate to="/" replace state={{ error: "🚫 Admin access only" }} />
    );
  }

  return children;
};
