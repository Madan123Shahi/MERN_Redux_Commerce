import { useState } from "react";
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Plus,
  ChevronDown,
} from "lucide-react";

import Logo from "../Images/Logo.webp";
import { Link } from "react-router-dom";
import LogoutButton from "../components/Logout";

/* ================= Sidebar Menu Config ================= */
const sidebarMenu = [
  {
    label: "Dashboard",
    icon: BarChart3,
    path: "/dashboard",
  },
  {
    label: "Home Slides",
    icon: Package,
    children: [
      {
        label: "Home Banners List",
        path: "/home-banners",
      },
      {
        label: "Add Home Banner Slide",
        path: "/home-slides/add",
      },
    ],
  },
  {
    label: "Products",
    icon: ShoppingCart,
    path: "/products",
  },
  {
    label: "Users",
    icon: Users,
    path: "/users",
  },
  {
    label: "Orders",
    icon: DollarSign,
    path: "/orders",
  },
];

export default function Dashboard() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white shadow-lg">
        <Link to="/dashboard" className="p-6 block">
          <img src={Logo} alt="Logo" className="h-8" />
        </Link>

        <nav className="px-4 space-y-1 text-gray-700">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenu === item.label;

            /* ---------- NORMAL LINK ---------- */
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg
                     hover:bg-green-50 transition"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            /* ---------- DROPDOWN ---------- */
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between
                     px-3 py-2 rounded-lg hover:bg-green-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.path}
                        className="block text-sm text-gray-600
                           hover:text-green-600 py-1 transition"
                      >
                        • {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= Logout Button (Top Right) ================= */}
      <div className="absolute top-4 right-6 z-50">
        <LogoutButton />
      </div>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-6">
        {/* ================= Header ================= */}
        <div
          className="bg-white rounded-xl p-6 shadow mb-6 mt-12
                        flex justify-between items-center"
        >
          <div>
            <h1 className="text-2xl font-bold">Welcome, SalesTeam</h1>
            <p className="text-gray-500 text-sm">
              Here’s what’s happening today
            </p>
          </div>

          {/* Add Product Button */}
          <button
            className="flex items-center gap-2 bg-blue-600 text-white
                       px-4 py-2 rounded-lg shadow
                       hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* ================= Stats Cards ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sales" value="$4,500" color="bg-green-500" />
          <StatCard title="Total Orders" value="320" color="bg-blue-500" />
          <StatCard title="Products" value="58" color="bg-indigo-500" />
          <StatCard title="Categories" value="12" color="bg-pink-500" />
        </div>

        {/* ================= Products Table ================= */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="font-semibold mb-4">Products</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left p-2">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">Sample Product {i}</td>
                  <td className="text-center">Fashion</td>
                  <td className="text-center">$199</td>
                  <td className="text-center">25</td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= Recent Orders ================= */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Recent Orders</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left p-2">Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">#ORD{i}23</td>
                  <td className="text-center">
                    <span
                      className="px-2 py-1 text-xs rounded
                                     bg-green-100 text-green-700"
                    >
                      Delivered
                    </span>
                  </td>
                  <td className="text-center">$1,200</td>
                  <td className="text-center">2026-01-06</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ================= Stat Card ================= */
function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-xl p-4 shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}
