import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen flex bg-linear-to-br from-green-50 to-green-100">
      <Sidebar collapsed={collapsed} />
      <main className="flex-1 relative">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
