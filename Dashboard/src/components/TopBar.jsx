import { useState, useRef, useEffect } from "react";
import { Bell, User, ChevronDown, Settings, LogOut } from "lucide-react";
import Logo from "../Images/Logo.webp";
import LogoutButton from "./Logout";
import { useSelector } from "react-redux";

export default function Topbar({ collapsed, setCollapsed }) {
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex items-center gap-4">
        {/* Logo only when sidebar collapsed */}
        {collapsed && (
          <img src={Logo} alt="Logo" className="h-8 w-auto object-contain" />
        )}

        {/* Hamburger */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-full hover:bg-green-500 transition"
        >
          <div className="flex flex-col gap-1">
            <span className="w-5 h-0.5 bg-gray-700"></span>
            <span className="w-3 h-0.5 bg-gray-500"></span>
            <span className="w-5 h-0.5 bg-gray-700"></span>
          </div>
        </button>
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-green-500 transition relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className={`flex items-center gap-2 px-2 py-1 rounded-full transition border 
              ${
                openProfile
                  ? "bg-gray-100 border-gray-200"
                  : "hover:bg-gray-100 border-transparent"
              }`}
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.name}&background=10b981&color=fff`
              }
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="px-5 py-4 border-b border-b-green-500">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <User size={16} />
                  My Profile
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Settings size={16} />
                  Account Settings
                </button>

                <div className="h-px bg-gray-100 my-1"></div>

                <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut size={16} />
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
