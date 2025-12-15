import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, ChevronDown } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-green-400 flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-xl font-bold text-gray-800">PioMart</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-gray-600 font-medium">
          <button className="flex items-center gap-1 text-green-600 font-semibold">
            <Menu size={18} />
            Browse Categories <ChevronDown size={16} />
          </button>
          <Link to="/deals" className="hover:text-green-600">
            Super Deals
          </Link>

          <Link to="/offers" className="text-orange-500 font-semibold">
            🔥 Special Offer
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-2 rounded-full hover:bg-green-50 text-gray-600">
            <Search size={20} />
          </button>

          {/* Cart */}
          <button className="relative p-2 rounded-full hover:bg-green-50 text-gray-600">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-green-400 text-gray-900 rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* Auth */}
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
          >
            <User size={18} />
            <span className="hidden sm:block text-sm font-medium">
              Login / Sign Up
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
