import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import Logo from "../Images/Logo.webp";

const sidebarMenu = [
  { label: "Dashboard", icon: BarChart3, path: "/dashboard" },
  {
    label: "Home Slides",
    icon: Package,
    children: [
      { label: "Home Banners List", path: "/dashboard/home-banners" },
      { label: "Add Home Banner Slide", path: "/dashboard/home-slides/add" },
    ],
  },
  { label: "Products", icon: ShoppingCart, path: "/dashboard/products" },
  { label: "Users", icon: Users, path: "/dashboard/users" },
  { label: "Orders", icon: DollarSign, path: "/dashboard/orders" },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside className="w-64 bg-white shadow-xl">
      <Link to="/dashboard" className="block p-6">
        <img src={Logo} alt="Logo" className="h-8 mx-auto" />
      </Link>

      <nav className="p-4 space-y-1 text-gray-700">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenu === item.label;

          if (!item.children) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 rounded-lg
                           hover:bg-green-50 hover:text-green-700 transition"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => setOpenMenu(isOpen ? null : item.label)}
                className="w-full flex justify-between items-center
                           px-4 py-2 rounded-lg hover:bg-green-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-10 mt-1 space-y-1 text-sm">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className="block py-1 text-gray-600 hover:text-green-600"
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
  );
}
