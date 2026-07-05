import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { AdminContext } from "../context/AdminContext";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { aToken } = useContext(AdminContext);

  const handleSearchClick = () => {
    // Focus search input on shop page or redirect to shop with query param to focus search
    if (window.location.pathname === "/") {
      const searchInput = document.getElementById("shop-search-input");
      if (searchInput) {
        searchInput.focus();
      }
    } else {
      navigate("/?focusSearch=true");
    }
  };

  return (
    <header className="w-full sticky top-0 z-50">
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

      {/* Main Navbar */}
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#17AD4C] to-[#139841] flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-105 transition-transform duration-300">
              <HiOutlineShoppingBag className="text-white text-lg sm:text-xl" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              <span className="text-[#17AD4C]">Tree</span>Cart
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 sm:gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 py-1.5 border-b-2 ${
                  isActive
                    ? "border-[#17AD4C] text-[#17AD4C]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/admin-dashboard"
              className="text-xs font-semibold py-2 px-4 rounded-full border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 flex items-center gap-1.5"
            >
              Seller Dashboard
            </NavLink>
          </div>

          {/* Right Icon Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/admin-dashboard"
              className="md:hidden text-xs font-semibold py-1.5 px-3 rounded-full border border-green-100 text-[#17AD4C] bg-green-50 hover:bg-green-100 transition-all duration-200"
            >
              Admin
            </Link>
            <button
              onClick={handleSearchClick}
              className="p-2 text-slate-500 hover:text-[#17AD4C] hover:bg-green-50 rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Search products"
              title="Search products"
            >
              <HiOutlineMagnifyingGlass className="text-xl sm:text-2xl" />
            </button>
            <Link
              to="/admin-dashboard"
              className="hidden md:flex items-center gap-1.5 p-2 px-3 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-full transition-all duration-200 cursor-pointer"
              title="Dashboard"
            >
              <HiOutlineUser className="text-xl sm:text-2xl" />
              <span className="text-xs font-medium hidden sm:inline text-slate-600">
                Dashboard
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;
