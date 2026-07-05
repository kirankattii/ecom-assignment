import { useEffect, useState, useContext, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { useDebounce } from "../hooks/useDebounce";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: { url: string; publicId: string }[];
  isActive: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Footwear",
  "Accessories",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Other",
];

const Shop = () => {
  const { backendUrl } = useContext(AdminContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Search states
  const [searchVal, setSearchVal] = useState<string>(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All Categories",
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams.get("sort") || "newest",
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1,
  );

  // Debounced search value
  const debouncedSearch = useDebounce<string>(searchVal, 400);

  // Products and loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Wishlist state persisted in Local Storage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  });

  // Input ref for auto-focusing
  const searchInputRef = useRef<HTMLInputElement>(null);


  // Toggle wishlist handler
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  // Auto focus search if redirect parameter present
  useEffect(() => {
    if (searchParams.get("focusSearch") === "true") {
      searchInputRef.current?.focus();
      // Remove query param without trigger re-render
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("focusSearch");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory !== "All Categories")
      params.category = selectedCategory;
    if (sortOption !== "newest") params.sort = sortOption;
    if (page > 1) params.page = String(page);

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, sortOption, page, setSearchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${backendUrl}/api/products?isActive=true&page=${page}&limit=8`;

        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
        if (selectedCategory && selectedCategory !== "All Categories") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (sortOption) {
          url += `&sort=${sortOption}`;
        }

        const { data } = await axios.get(url);
        if (data.success) {
          setProducts(data.data.products);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl, debouncedSearch, selectedCategory, sortOption, page]);

  // Reset page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages = [];
    const total = pagination.totalPages;
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Title Heading */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            All{" "}
            <span className="relative inline-block">
              products
              <span className="absolute bottom-[-6px] left-0 right-0 h-1 bg-[#17AD4C] rounded" />
            </span>
          </h2>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4 mb-6 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <HiOutlineMagnifyingGlass className="text-lg" />
            </span>
            <input
              id="shop-search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search products by name..."
              className="bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#17AD4C] focus:ring-2 focus:ring-[#17AD4C]/15 w-full text-sm sm:text-base transition-all"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          {/* Filters dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Select */}
            <div className="flex-1 md:flex-initial">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-700 font-medium text-sm focus:outline-none focus:border-[#17AD4C] focus:ring-2 focus:ring-[#17AD4C]/15 w-full md:min-w-48 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex-1 md:flex-initial">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-700 font-medium text-sm focus:outline-none focus:border-[#17AD4C] focus:ring-2 focus:ring-[#17AD4C]/15 w-full md:min-w-44 transition-all cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="aspect-square bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-8 bg-slate-150 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-slate-200/85 hover:border-[#17AD4C]/30 rounded-2xl p-2 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 ">
                    <img
                      src={product.images?.[0]?.url || ""}
                      alt={product.name}
                      className="w-full h-full object-cover p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-slate-400 hover:scale-110 active:scale-95 transition-all shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer"
                      title={
                        wishlist.includes(product._id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {wishlist.includes(product._id) ? (
                        <HiHeart className="text-rose-500 text-base" />
                      ) : (
                        <HiOutlineHeart className="text-slate-400 text-base" />
                      )}
                    </button>
                  </div>

                  {/* Content details */}
                  <div className="flex-1 flex flex-col">
                    <Link
                      to={`/product/${product._id}`}
                      className="hover:text-[#17AD4C] transition-colors"
                    >
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-1 flex-1">
                      {product.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-xs font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-slate-200 hover:border-[#17AD4C] text-slate-700 hover:text-white hover:bg-[#17AD4C] transition-all duration-200 cursor-pointer"
                      >
                        Buy <span className="hidden sm:inline">now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {products.length === 0 && (
              <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
                <span className="text-4xl">🔍</span>
                <h3 className="text-slate-700 font-semibold text-lg mt-3">
                  No Products Found
                </h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  We couldn't find any products matching your active filter
                  criteria. Try adjusting your search term or category.
                </p>
                <button
                  onClick={() => {
                    setSearchVal("");
                    setSelectedCategory("All Categories");
                    setSortOption("newest");
                  }}
                  className="mt-4 text-sm font-semibold text-[#17AD4C] hover:text-[#139841] border-b border-[#17AD4C] hover:border-transparent transition-all cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Pagination controls */}
            {pagination && pagination.totalProducts > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-slate-150">
                {/* Info Text */}
                <div className="text-xs sm:text-sm text-slate-500 font-medium">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(
                      (page - 1) * pagination.limit + 1,
                      pagination.totalProducts,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(
                      page * pagination.limit,
                      pagination.totalProducts,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {pagination.totalProducts}
                  </span>{" "}
                  entries
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-350 disabled:opacity-45 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        num === page
                          ? "bg-[#17AD4C] text-white shadow-md shadow-green-500/10"
                          : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 cursor-pointer"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-350 disabled:opacity-45 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
