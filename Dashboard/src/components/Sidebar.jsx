import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import Logo from "../Images/Logo.webp";

/* ================= SIDEBAR MENU ================= */
const sidebarMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    label: "Home Slides",
    icon: Package,
    children: [
      { label: "Banners List", path: "/dashboard/home-banners" },
      { label: "Add Slide", path: "/dashboard/home-slides/add" },
    ],
  },
  { label: "Products", icon: ShoppingCart, path: "/dashboard/products" },
  { label: "Users", icon: Users, path: "/dashboard/users" },
  { label: "Orders", icon: DollarSign, path: "/dashboard/orders" },
];

export default function Sidebar({ collapsed }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#022c22] text-slate-300 transition-all duration-300 ease-in-out border-r border-emerald-900/30 shadow-2xl
      ${collapsed ? "w-0 overflow-hidden" : "w-72"}`}
    >
      {/* ================= LOGO ================= */}
      {!collapsed && (
        <div className="flex items-center justify-center py-5 mb-2">
          <Link
            to="/dashboard"
            className="hover:scale-105 transition-transform"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      {!collapsed && (
        <nav ref={navRef} className="px-4 space-y-2">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenu === item.label;
            const isActive = location.pathname === item.path;

            /* ---------- NORMAL LINK ---------- */
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpenMenu(null)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-400 text-[#022c22] font-bold shadow-[0_4px_15px_rgba(52,211,153,0.3)]"
                        : "hover:bg-emerald-800/30 hover:text-emerald-400"
                    }`}
                >
                  <Icon size={20} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </Link>
              );
            }

            /* ---------- DROPDOWN ---------- */
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all
                    ${
                      isOpen
                        ? "bg-emerald-900/40 text-emerald-400"
                        : "hover:bg-emerald-800/30 hover:text-emerald-400"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="text-sm font-medium tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-400" : "opacity-50"
                    }`}
                  />
                </button>

                {/* ---------- DROPDOWN ITEMS ---------- */}
                <div
                  onClick={(e) => e.stopPropagation()} // 🔥 KEY FIX
                  className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="ml-9 border-l border-emerald-800/50 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.path}
                        onClick={(e) => e.stopPropagation()} // 🔥 KEY FIX
                        className={`block py-2 pl-6 pr-4 text-sm font-semibold rounded-r-lg transition-colors
                          ${
                            location.pathname === child.path
                              ? "text-emerald-400 bg-emerald-400/10"
                              : "text-slate-400 hover:text-emerald-300 hover:bg-emerald-800/20"
                          }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
