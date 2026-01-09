import {
  Plus,
  TrendingUp,
  ShoppingBag,
  Box,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, Sales Team <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Here’s a summary of your shop's performance today.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-[#022c22] font-bold px-5 py-2.5 rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-0.5 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Add Product
        </button>
      </div>

      {/* ================= Stats Grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Sales"
          value="$4,500"
          icon={TrendingUp}
          trend="+12.5%"
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value="320"
          icon={ShoppingBag}
          trend="+5.2%"
          color="blue"
        />
        <StatCard
          title="Active Products"
          value="58"
          icon={Box}
          trend="0%"
          color="amber"
        />
        <StatCard
          title="Categories"
          value="12"
          icon={Layers}
          trend="+2"
          color="purple"
        />
      </div>

      {/* ================= Tables Section ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DashboardTable title="Top Products" type="products" />
        <DashboardTable title="Recent Orders" type="orders" />
      </div>
    </div>
  );
}

/* ================= StatCard Component ================= */

function StatCard({ title, value, icon: Icon, trend, color }) {
  // Mapping dynamic colors for icons
  const colors = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 transition-all hover:shadow-xl group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl ${colors[color]} transition-transform group-hover:scale-110`}
        >
          <Icon size={24} />
        </div>
        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} className="mr-1" /> {trend}
        </span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  );
}

/* ================= DashboardTable Component ================= */

function DashboardTable({ title }) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
        <button className="text-xs font-bold text-emerald-600 hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="text-left px-6 py-4 font-bold">Item Name</th>
              <th className="text-center px-6 py-4 font-bold">Status</th>
              <th className="text-right px-6 py-4 font-bold">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4].map((i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      {i}
                    </div>
                    <span className="font-semibold text-slate-700">
                      Premium Item {i}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tighter">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono font-bold text-slate-900">
                    $1,200.00
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
