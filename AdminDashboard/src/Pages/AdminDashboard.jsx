// src/Pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Package,
  DollarSign,
  Users,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from "recharts";
import toast, { Toaster } from "react-hot-toast";
import Modal from "react-modal";

/* ---------------- Redux ---------------- */
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../app/features/productSlice";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../app/features/categorySlice";

import {
  fetchSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../app/features/subCategorySlice";

Modal.setAppElement("#root");

/* ---------------- Charts ---------------- */
const sparkData = [
  { value: 10 },
  { value: 20 },
  { value: 15 },
  { value: 30 },
  { value: 25 },
  { value: 40 },
];

const revenueData = [
  { day: "Mon", revenue: 8000 },
  { day: "Tue", revenue: 12000 },
  { day: "Wed", revenue: 10000 },
  { day: "Thu", revenue: 15000 },
  { day: "Fri", revenue: 20000 },
];

const ordersData = [
  { day: "Mon", orders: 10 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 15 },
  { day: "Thu", orders: 25 },
  { day: "Fri", orders: 30 },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();

  /* ---------------- Redux State ---------------- */
  const {
    products = [],
    total: totalProducts = 0,
    loading: loadingProducts = false,
  } = useSelector((s) => s.product || {});

  const {
    categories = [],
    total: totalCategories = 0,
    loading: loadingCategories = false,
  } = useSelector((s) => s.category || {});

  const {
    subCategories = [],
    total: totalSubCategories = 0,
    loading: loadingSubCategories = false,
  } = useSelector((s) => s.subCategory || {}); // ✅ FIXED KEY

  /* ---------------- UI ---------------- */
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------------- Modal ---------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    name: "",
    category: "",
  });

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories({}));
    dispatch(fetchSubCategories({}));
  }, [dispatch]);

  /* ---------------- Modal Handlers ---------------- */
  const openAdd = (type) => {
    setModalType(type);
    setEditItem(null);
    setFormData({ title: "", price: "", name: "", category: "" });
    setModalOpen(true);
  };

  const openEdit = (type, item) => {
    setModalType(type);
    setEditItem(item);

    if (type === "product") {
      setFormData({ title: item.title, price: item.price });
    } else if (type === "category") {
      setFormData({ name: item.name });
    } else {
      setFormData({
        name: item.name,
        category: item.category?._id,
      });
    }

    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "product") {
        editItem
          ? await dispatch(
              updateProduct({ id: editItem._id, data: formData })
            ).unwrap()
          : await dispatch(createProduct(formData)).unwrap();
      }

      if (modalType === "category") {
        editItem
          ? await dispatch(
              updateCategory({
                id: editItem._id,
                data: { name: formData.name },
              })
            ).unwrap()
          : await dispatch(createCategory({ name: formData.name })).unwrap();
      }

      if (modalType === "subCategory") {
        editItem
          ? await dispatch(
              updateSubCategory({
                id: editItem._id,
                data: { name: formData.name, category: formData.category },
              })
            ).unwrap()
          : await dispatch(
              createSubCategory({
                name: formData.name,
                category: formData.category,
              })
            ).unwrap();
      }

      toast.success("Saved successfully");
      setModalOpen(false);
    } catch {
      toast.error("Action failed");
    }
  };

  /* ---------------- Stats ---------------- */
  const stats = [
    {
      title: "Products",
      value: totalProducts,
      icon: <Package />,
      stroke: "#8b5cf6",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: <BarChart3 />,
      stroke: "#3b82f6",
    },
    {
      title: "Sub Categories",
      value: totalSubCategories,
      icon: <Users />,
      stroke: "#6366f1",
    },
    {
      title: "Revenue",
      value: "₹50,000",
      icon: <DollarSign />,
      stroke: "#f97316",
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <Toaster />
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 dark:text-white">
        {/* Sidebar */}
        <aside
          className={`fixed w-64 h-full bg-white dark:bg-gray-800 shadow z-20 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition`}
        >
          <div className="p-6 flex justify-between font-bold text-green-500">
            Admin Panel
            <X className="md:hidden" onClick={() => setSidebarOpen(false)} />
          </div>
          <nav className="px-4 space-y-2">
            <NavItem
              to="/admin/dashboard"
              icon={<BarChart3 />}
              label="Dashboard"
            />
            <NavItem to="/admin/products" icon={<Package />} label="Products" />
            <NavItem
              to="/admin/categories"
              icon={<Users />}
              label="Categories"
            />
            <NavItem
              to="/admin/subCategories"
              icon={<Users />}
              label="Sub Categories"
            />
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:ml-64">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s) => (
              <div
                key={s.title}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500">{s.title}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                  </div>
                  <div className="text-green-500">{s.icon}</div>
                </div>

                <ResponsiveContainer width="100%" height={48}>
                  <LineChart data={sparkData}>
                    <Line dataKey="value" stroke={s.stroke} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue">
              <LineChart data={revenueData}>
                <Line dataKey="revenue" stroke="#f97316" />
              </LineChart>
            </ChartCard>

            <ChartCard title="Orders">
              <BarChart data={ordersData}>
                <Bar dataKey="orders" fill="#22c55e" />
              </BarChart>
            </ChartCard>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black/50"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === "product" && (
            <>
              <input
                className="w-full p-2 border rounded"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </>
          )}

          {modalType === "category" && (
            <input
              className="w-full p-2 border rounded"
              placeholder="Category name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          {modalType === "subCategory" && (
            <>
              <input
                className="w-full p-2 border rounded"
                placeholder="Subcategory name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------------- Reusable ---------------- */
function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className="flex gap-2 px-4 py-3 rounded hover:bg-green-50 dark:hover:bg-gray-700"
    >
      <span className="text-green-500">{icon}</span>
      {label}
    </NavLink>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
