import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineTag,
} from "react-icons/hi2";

const Dashboard = () => {
  const { getDashData, aToken, dashData } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: dashData.totalProducts,
      icon: HiOutlineCube,
      gradient: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/5",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      label: "Active Products",
      value: dashData.activeProducts,
      icon: HiOutlineCheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/5",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Categories",
      value: dashData.totalCategories,
      icon: HiOutlineTag,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/5",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Low Stock",
      value: dashData.lowStockProducts,
      icon: HiOutlineExclamationTriangle,
      gradient: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/5",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border border-slate-200/80 rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 ${stat.shadow} shadow-md`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`text-2xl ${stat.text}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Products */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
          <HiOutlineCube className="text-indigo-600 text-lg" />
          <p className="font-semibold text-slate-900">Recent Products</p>
        </div>
        <div>
          {dashData.latestProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
            >
              <img
                className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100"
                src={product.images?.[0]?.url || ""}
                alt={product.name}
              />
              <div className="flex-1 ml-4">
                <p className="text-slate-800 font-medium text-sm">
                  {product.name}
                </p>
                <p className="text-slate-500 text-xs">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-800 font-semibold text-sm">
                  ₹{product.price.toLocaleString()}
                </p>
                <p
                  className={`text-xs ${product.stock < 10 ? "text-rose-600 font-medium" : "text-slate-400"}`}
                >
                  Stock: {product.stock}
                </p>
              </div>
              <span
                className={`ml-4 text-xs font-medium px-2.5 py-1 rounded-full border ${
                  product.isActive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100/60"
                    : "bg-slate-100 text-slate-500 border-slate-200/60"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
          {dashData.latestProducts.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400">
              No products yet. Add your first product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
