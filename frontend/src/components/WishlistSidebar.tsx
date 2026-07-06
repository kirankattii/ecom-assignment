import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiXMark,
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { WishlistContext } from "../context/WishlistContext";

const WishlistSidebar = () => {
  const {
    wishlistProducts,
    loading,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    clearWishlist,
  } = useContext(WishlistContext);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Close sidebar/modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirmModal) {
          setShowConfirmModal(false);
        } else if (isWishlistOpen) {
          setIsWishlistOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistOpen, showConfirmModal, setIsWishlistOpen]);

  // Trap body scroll when sidebar or modal is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  const handleClearConfirm = () => {
    clearWishlist();
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Backdrop for Sidebar */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isWishlistOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Wishlist Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] sm:w-[448px] bg-white border-l border-slate-200/80 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200/85 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <HiOutlineHeart className="text-rose-500 text-2xl" />
            <h2 className="text-lg font-bold text-slate-900">My Wishlist</h2>
            {wishlistProducts.length > 0 && (
              <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {wishlistProducts.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close Wishlist"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>

        {/* Wishlist Product List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && wishlistProducts.length === 0 ? (
            // Skeleton Loader
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-3 border border-slate-100 rounded-xl animate-pulse"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-150 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistProducts.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                <HiOutlineHeart className="text-3xl" />
              </div>
              <h3 className="text-slate-850 font-bold text-lg">
                Your wishlist is empty
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                Explore our catalog, select items that you like and save them
                here!
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-6 bg-[#17AD4C] hover:bg-[#139841] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-green-500/10 cursor-pointer"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            // Wishlist Items
            <div className="divide-y divide-slate-100">
              {wishlistProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between group"
                >
                  <Link
                    to={`/product/${p._id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="flex gap-4 items-center flex-1 min-w-0"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <img
                        src={p.images?.[0]?.url || ""}
                        alt={p.name}
                        className="w-full h-full object-cover p-1 group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#17AD4C] tracking-wide">
                        {p.category}
                      </span>
                      <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate group-hover:text-[#17AD4C] transition-colors leading-tight">
                        {p.name}
                      </h4>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">
                        ₹{p.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(p._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions (Only visible when items exist) */}
        {wishlistProducts.length > 0 && (
          <div className="p-5 border-t border-slate-200/80 bg-slate-50 flex gap-3">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex-1 py-3 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 active:scale-98 text-sm font-semibold transition-all duration-200 cursor-pointer text-center"
            >
              Clear Wishlist
            </button>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#17AD4C] hover:bg-[#139841] text-white text-sm font-semibold shadow-md shadow-green-500/10 active:scale-98 transition-all cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            onClick={() => setShowConfirmModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center transform transition-all duration-300 scale-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <HiOutlineExclamationTriangle className="text-2xl" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Clear Wishlist?
            </h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Are you sure you want to clear all items from your wishlist? This
              action cannot be undone.
            </p>

            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConfirm}
                className="flex-1 py-2.5 text-white bg-rose-600 hover:bg-rose-700 text-sm font-semibold rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistSidebar;
