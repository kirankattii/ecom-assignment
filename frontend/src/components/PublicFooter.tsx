import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ff6f00] flex items-center justify-center shadow-md shadow-orange-500/20">
                <HiOutlineShoppingBag className="text-white text-base" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                <span className="text-[#ff6f00]">Quick</span>Cart
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A premium, high-performance demo e-commerce store designed to deliver an exceptional shopping experience.
            </p>
          </div>

          {/* Shop Categories Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Shop</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/?category=Electronics" className="hover:text-white hover:underline transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/?category=Clothing" className="hover:text-white hover:underline transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/?category=Footwear" className="hover:text-white hover:underline transition-colors">
                  Footwear
                </Link>
              </li>
              <li>
                <Link to="/?category=Accessories" className="hover:text-white hover:underline transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Access</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white hover:underline transition-colors">
                  Seller Dashboard / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Subscribe to get notifications about new releases and special offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff6f00] focus:ring-1 focus:ring-[#ff6f00]/30 w-full"
                required
              />
              <button
                type="submit"
                className="bg-[#ff6f00] hover:bg-[#e65c00] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/10 active:scale-95 transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="h-px bg-slate-800 my-8 sm:my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QuickCart Demo. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;
