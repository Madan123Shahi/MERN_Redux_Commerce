import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "./Logout";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-end items-center px-6 py-4 bg-white shadow-sm">
        <LogoutButton />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
