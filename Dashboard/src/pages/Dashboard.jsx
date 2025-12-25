// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "./Logout";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <LogoutButton />
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet />{" "}
        {/* Nested routes (Categories, SubCategories, Products) render here */}
      </div>
    </div>
  );
};

export default DashboardLayout;
