import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineExclamationTriangle,
  HiOutlineXMark,
} from "react-icons/hi2";

const ProductList = () => {
  const {
    products,
    aToken,
    getAllProducts,
    deleteProduct,
    toggleProductActive,
    currentPage,
    totalPages,
    totalProducts,
    limit,
    loading,
  } = useContext(AdminContext);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (aToken) {
      getAllProducts(currentPage, limit);
    }
  }, [aToken, currentPage, limit]);

  const handleDelete = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex-1 p-3 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">All Products</h2>
        <span className="text-sm text-slate-500">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px_120px] gap-4 items-center px-6 py-3 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-[80px_2fr_1fr_1fr_1fr_100px_120px] gap-3 md:gap-4 items-center px-6 py-4 border-b border-slate-100 last:border-b-0 animate-pulse"
              >
                {/* Image Shimmer */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200/50" />

                {/* Name & Description Shimmer */}
                <div className="min-w-0 flex flex-col gap-2">
                  <div className="h-4 bg-slate-200/80 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>

                {/* Category Shimmer */}
                <div className="h-4 bg-slate-100 rounded w-2/3" />

                {/* Price Shimmer */}
                <div className="h-4 bg-slate-100 rounded w-1/2" />

                {/* Stock Shimmer */}
                <div className="h-4 bg-slate-100 rounded w-1/3" />

                {/* Status Switch Shimmer */}
                <div className="w-10 h-5 rounded-full bg-slate-100" />

                {/* Actions Shimmer */}
                <div className="flex items-center justify-end gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100" />
                  <div className="w-8 h-8 rounded-lg bg-slate-100" />
                  <div className="w-8 h-8 rounded-lg bg-slate-100" />
                </div>
              </div>
            ))
          ) : (
            <>
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-1 md:grid-cols-[80px_2fr_1fr_1fr_1fr_100px_120px] gap-3 md:gap-4 items-center px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/40 transition-colors"
                >
                  {/* Image */}
                  <img
                    className="w-14 h-14 rounded-lg object-cover bg-slate-50 border border-slate-200/60"
                    src={product.images?.[0]?.url || ""}
                    alt={product.name}
                  />

                  {/* Name & Description */}
                  <div className="min-w-0">
                    <p className="text-slate-800 font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  {/* Category */}
                  <span className="text-sm text-slate-600">
                    <span className="md:hidden text-slate-400 text-xs">
                      Category:{" "}
                    </span>
                    {product.category}
                  </span>

                  {/* Price */}
                  <span className="text-sm text-slate-800 font-medium">
                    <span className="md:hidden text-slate-400 text-xs">
                      Price:{" "}
                    </span>
                    ₹{product.price.toLocaleString()}
                  </span>

                  {/* Stock */}
                  <span
                    className={`text-sm font-medium ${product.stock < 10 ? "text-rose-600 font-medium" : "text-slate-600"}`}
                  >
                    <span className="md:hidden text-slate-400 text-xs">
                      Stock:{" "}
                    </span>
                    {product.stock}
                  </span>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleProductActive(product._id, !product.isActive)
                      }
                      className={`relative inline-flex items-center h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out px-0.5 ${
                        product.isActive ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          product.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveImageIndex(0);
                      }}
                      className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 transition-all cursor-pointer"
                      title="Product Dive"
                    >
                      <HiOutlineEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                      className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-500/30 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <HiOutlinePencilSquare className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <HiOutlineTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="px-6 py-16 text-center text-slate-400">
                  <p className="text-lg mb-1">No products found</p>
                  <p className="text-sm">Start by adding your first product.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination Footer */}
        {totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            {/* Page Info */}
            <div className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {Math.min((currentPage - 1) * limit + 1, totalProducts)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * limit, totalProducts)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {totalProducts}
              </span>{" "}
              entries
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => getAllProducts(currentPage - 1, limit)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof page === "number" && getAllProducts(page, limit)
                  }
                  disabled={page === "..."}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    page === currentPage
                      ? "bg-indigo-600 border-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20"
                      : page === "..."
                        ? "border-transparent text-slate-400 cursor-default"
                        : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => getAllProducts(currentPage + 1, limit)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Dive Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-scaleUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-150">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-55 bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <HiOutlineEye className="text-xl" />
                </span>
                Product Details
              </h3>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveImageIndex(0);
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image Gallery */}
              <div className="flex flex-col gap-4">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center relative">
                  {selectedProduct.images?.[activeImageIndex]?.url ? (
                    <img
                      src={selectedProduct.images[activeImageIndex].url}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-400 text-sm">No Image</span>
                  )}
                  {selectedProduct.images?.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-gray-300 font-medium">
                      {activeImageIndex + 1} / {selectedProduct.images.length}
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedProduct.images?.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {selectedProduct.images.map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border bg-slate-50 flex-shrink-0 transition-all ${
                          idx === activeImageIndex
                            ? "border-indigo-500 scale-95 shadow-lg"
                            : "border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Information */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {selectedProduct.category}
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mt-3 leading-snug">
                    {selectedProduct.name}
                  </h4>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Price
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      ₹{selectedProduct.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Stock Status
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-base font-bold ${selectedProduct.stock < 10 ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {selectedProduct.stock}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                          selectedProduct.stock === 0
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : selectedProduct.stock < 10
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {selectedProduct.stock === 0
                          ? "Out of Stock"
                          : selectedProduct.stock < 10
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-200/40 max-h-[150px] overflow-y-auto whitespace-pre-line">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Status:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded border ${
                        selectedProduct.isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100/60"
                          : "bg-slate-100 text-slate-500 border-slate-200/60"
                      }`}
                    >
                      {selectedProduct.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Created At:</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(selectedProduct.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-150 bg-slate-50/80">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveImageIndex(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  navigate(`/edit-product/${selectedProduct._id}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scaleUp p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 animate-bounce">
                <HiOutlineExclamationTriangle className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Delete Product?
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-rose-600">
                  "{productToDelete.name}"
                </span>
                ? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
