import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const Navbar = () => {
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    setAToken("");
    localStorage.removeItem("aToken");
  };

  return (
    <nav className="flex justify-between items-center px-6 sm:px-10 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <HiOutlineShoppingBag className="text-white text-lg" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
          ShopAdmin
        </h1>
        <span className="ml-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          Admin
        </span>
      </div>
      <button
        onClick={logout}
        className="text-sm font-medium px-5 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
