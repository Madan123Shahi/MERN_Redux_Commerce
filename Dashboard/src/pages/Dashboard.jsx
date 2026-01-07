import { Plus } from "lucide-react";

export default function DashboardHome() {
  return (
    <>
      {/* ================= Header ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 mt-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, Sales Team 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Here’s what’s happening today
            </p>
          </div>

          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Sales" value="$4,500" />
        <StatCard title="Orders" value="320" />
        <StatCard title="Products" value="58" />
        <StatCard title="Categories" value="12" />
      </div>

      {/* ================= Tables ================= */}
      <DashboardTable title="Products" />
      <DashboardTable title="Recent Orders" />
    </>
  );
}

/* ================= Components ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-green-400">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
  );
}

function DashboardTable({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6">
      <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-center">Status</th>
            <th className="text-center">Value</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">Item {i}</td>
              <td className="text-center">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  Active
                </span>
              </td>
              <td className="text-center">$1200</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
