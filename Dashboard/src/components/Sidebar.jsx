// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const activeClass = "bg-green-600 text-white px-3 py-2 rounded";
  const inactiveClass =
    "text-gray-200 hover:bg-green-500 hover:text-white px-3 py-2 rounded";

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard/categories"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Categories
        </NavLink>
        <NavLink
          to="/dashboard/subcategories"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          SubCategories
        </NavLink>
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Products
        </NavLink>
      </nav>
    </div>
  );
}
