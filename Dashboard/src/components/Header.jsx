import { useState } from "react";
import { Menu, X, ShoppingCart, Search, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-wide cursor-pointer">
          Shop<span className="text-blue-600">Ease</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-lg relative">
          <a href="/" className="hover:text-blue-600 transition">
            Home
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              Categories <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-8 left-0 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 w-40"
                >
                  <a href="/category/men" className="hover:text-blue-600">
                    Men
                  </a>
                  <a href="/category/women" className="hover:text-blue-600">
                    Women
                  </a>
                  <a
                    href="/category/electronics"
                    className="hover:text-blue-600"
                  >
                    Electronics
                  </a>
                  <a href="/category/home" className="hover:text-blue-600">
                    Home
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="/deals" className="hover:text-blue-600 transition">
            Deals
          </a>
          <a href="/contact" className="hover:text-blue-600 transition">
            Contact
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-72">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent w-full outline-none ml-2"
          />
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-5">
          <ShoppingCart className="cursor-pointer hover:text-blue-600" />
          <User className="cursor-pointer hover:text-blue-600" />
        </div>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white shadow-md border-t p-4 flex flex-col gap-4 text-lg"
          >
            <a href="/" className="hover:text-blue-600">
              Home
            </a>

            {/* Mobile Categories */}
            <details className="cursor-pointer">
              <summary className="flex items-center gap-1">Categories</summary>
              <div className="flex flex-col gap-2 ml-4 mt-2">
                <a href="/category/men" className="hover:text-blue-600">
                  Men
                </a>
                <a href="/category/women" className="hover:text-blue-600">
                  Women
                </a>
                <a href="/category/electronics" className="hover:text-blue-600">
                  Electronics
                </a>
                <a href="/category/home" className="hover:text-blue-600">
                  Home
                </a>
              </div>
            </details>

            <a href="/deals" className="hover:text-blue-600">
              Deals
            </a>
            <a href="/contact" className="hover:text-blue-600">
              Contact
            </a>

            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full">
              <Search className="text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent w-full outline-none ml-2"
              />
            </div>

            <div className="flex items-center gap-5 mt-2 border-t pt-4">
              <ShoppingCart className="cursor-pointer hover:text-blue-600" />
              <User className="cursor-pointer hover:text-blue-600" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
