import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const Navbar = () => {
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    navigate("/");
    setAToken("");
    localStorage.removeItem("aToken");
    setShowLogoutModal(false);
  };

  return (
    <div className="contents">
      {/* Top Green Announcement Bar */}
      <div className="bg-[#17AD4C] text-white text-xs py-2 px-4 text-center font-medium shadow-sm transition-all duration-200">
        Source Code of this Assignment
        <a
          href="https://github.com/kirankattii/ecom-assignment"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-green-100 transition-colors font-semibold ml-1"
        >
          Get Source Code
        </a>
      </div>
      <nav className="flex justify-between items-center px-6 sm:px-10  py-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-gradient-to-br from-[#17AD4C] to-[#139841] flex items-center justify-center shadow-lg shadow-green-500/25">
            <HiOutlineShoppingBag className="text-white text-lg" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            TreeAdmin
          </h1>
          <span className="hidden sm:inline-block ml-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-[#17AD4C] border border-green-100">
            Admin
          </span>
          <Link
            to="/"
            className="ml-4 text-xs font-semibold text-[#17AD4C] hover:text-[#139841] transition-colors flex items-center gap-1"
          >
            View Store ↗
          </Link>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="text-sm font-medium p-2.5 sm:px-5 sm:py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 cursor-pointer flex items-center gap-2"
          title="Logout"
        >
          <HiOutlineArrowRightOnRectangle className="text-lg" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scaleUp p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 text-[#17AD4C] flex items-center justify-center mb-4">
                <HiOutlineArrowRightOnRectangle className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Logout</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Are you sure you want to log out of your admin dashboard?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-[#17AD4C] hover:bg-[#139841] text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
