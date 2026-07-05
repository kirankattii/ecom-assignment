import { NavLink } from "react-router-dom";
import {
  HiOutlineChartBarSquare,
  HiOutlinePlusCircle,
  HiOutlineRectangleStack,
} from "react-icons/hi2";

const navItems = [
  {
    to: "/admin-dashboard",
    label: "Dashboard",
    icon: HiOutlineChartBarSquare,
  },
  {
    to: "/add-product",
    label: "Add Product",
    icon: HiOutlinePlusCircle,
  },
  {
    to: "/product-list",
    label: "Product List",
    icon: HiOutlineRectangleStack,
  },
];

const Sidebar = () => {
  return (
    <aside className="sticky top-[69px] h-[calc(100vh-69px)] bg-white border-r border-slate-200 pt-6 overflow-y-auto flex-shrink-0">
      <ul className="flex flex-col gap-1 pr-1 md:px-3">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 md:px-6 md:min-w-64 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-green-50 text-[#17AD4C] border-r-3 border-[#17AD4C] shadow-sm shadow-green-500/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <item.icon className="text-xl flex-shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
