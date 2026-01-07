import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/Logout";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-green-50 to-green-100">
      <Sidebar />

      <main className="flex-1 p-6 relative">
        <div className="absolute top-2 right-6">
          <LogoutButton />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
