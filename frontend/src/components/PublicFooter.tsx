import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#17AD4C] flex items-center justify-center shadow-md shadow-green-500/10 group-hover:scale-105 transition-transform duration-300">
            <HiOutlineShoppingBag className="text-white text-base" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            <span className="text-[#17AD4C]">Tree</span>Cart
          </span>
        </Link>
        {/* Copyright */}
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Tree Cart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;
