import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";

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

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { backendUrl } = useContext(AdminContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredLoading, setFeaturedLoading] = useState<boolean>(true);

  // Wishlist state persisted in Local Storage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  });

  // Original price helper
  const getOriginalPrice = (price: number) => (price * 1.1).toFixed(2);

  // Toggle wishlist handler
  const toggleWishlist = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const updated = prev.includes(targetId) ? prev.filter((item) => item !== targetId) : [...prev, targetId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setActiveImageIndex(0);
        const { data } = await axios.get(`${backendUrl}/api/products/${id}`);
        if (data.success) {
          setProduct(data.data);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [backendUrl, id]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setFeaturedLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/products?limit=5`);
        if (data.success) {
          // Filter out the current product
          const filtered = data.data.products.filter((p: Product) => p._id !== id).slice(0, 4);
          setFeaturedProducts(filtered);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setFeaturedLoading(false);
      }
    };

    if (id) {
      fetchFeatured();
    }
  }, [backendUrl, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-slate-100 rounded-lg" />
              <div className="w-16 h-16 bg-slate-100 rounded-lg" />
              <div className="w-16 h-16 bg-slate-100 rounded-lg" />
            </div>
          </div>
          {/* Info skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-slate-150 rounded w-1/4 mb-2" />
            <div className="h-20 bg-slate-100 rounded w-full mb-4" />
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-32 bg-slate-50 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The product you're looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-[#17AD4C] hover:bg-[#139841] text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 sm:mb-12">
          <Link to="/" className="hover:text-[#17AD4C] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Product Images */}
          <div className="flex flex-col gap-4">
            {/* Big Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60 flex items-center justify-center">
              <img
                src={product.images?.[activeImageIndex]?.url || ""}
                alt={product.name}
                className="w-full h-full object-contain p-4 sm:p-6"
              />
              <button
                onClick={(e) => toggleWishlist(product._id, e)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-slate-400 hover:scale-105 active:scale-95 transition-all shadow-md border border-slate-150 flex items-center justify-center cursor-pointer"
                title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist.includes(product._id) ? (
                  <HiHeart className="text-rose-500 text-xl" />
                ) : (
                  <HiOutlineHeart className="text-slate-400 text-xl" />
                )}
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 border transition-all flex-shrink-0 cursor-pointer ${
                      idx === activeImageIndex
                        ? "border-[#17AD4C] scale-95 shadow-md shadow-green-500/5"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Metadata and Pricing */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#17AD4C] border border-green-100 mb-3 sm:mb-4">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                ₹{product.price.toFixed(2)}
              </span>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Description */}
            <div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Metadata Table */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-200/50">
                    <td className="py-2.5 font-medium text-slate-500 w-1/3">Brand</td>
                    <td className="py-2.5 text-slate-800 font-semibold">Generic</td>
                  </tr>
                  <tr className="border-b border-slate-200/50">
                    <td className="py-2.5 font-medium text-slate-500">Color</td>
                    <td className="py-2.5 text-slate-800 font-semibold">Multi</td>
                  </tr>
                  <tr className="border-b border-slate-200/50">
                    <td className="py-2.5 font-medium text-slate-500">Category</td>
                    <td className="py-2.5 text-slate-800 font-semibold">{product.category}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-slate-500">Availability</td>
                    <td className="py-2.5 font-semibold">
                      <span className={product.stock > 0 ? "text-emerald-600" : "text-rose-600"}>
                        {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="flex-1 py-3 px-6 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-350 text-sm font-semibold transition-all duration-200 cursor-pointer text-center">
                Add to Cart
              </button>
              <button className="flex-1 py-3 px-6 rounded-xl bg-[#17AD4C] hover:bg-[#139841] text-white text-sm font-semibold shadow-lg shadow-green-500/20 active:scale-98 transition-all cursor-pointer text-center">
                Buy <span className="hidden sm:inline">now</span>
              </button>
            </div>

          </div>
        </div>

        {/* Featured Products */}
        <section className="mt-20 sm:mt-28 border-t border-slate-200 pt-16">
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Featured{" "}
              <span className="relative inline-block">
                Products
                <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#17AD4C] rounded" />
              </span>
            </h2>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-slate-200/85 hover:border-[#17AD4C]/30 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <img
                      src={p.images?.[0]?.url || ""}
                      alt={p.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => toggleWishlist(p._id, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-slate-400 hover:scale-110 active:scale-95 transition-all shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer"
                      title={wishlist.includes(p._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {wishlist.includes(p._id) ? (
                        <HiHeart className="text-rose-500 text-base" />
                      ) : (
                        <HiOutlineHeart className="text-slate-400 text-base" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${p._id}`} className="hover:text-[#17AD4C] transition-colors">
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-1 flex-1">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <Link
                        to={`/product/${p._id}`}
                        className="text-xs font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-slate-200 hover:border-[#17AD4C] text-slate-700 hover:text-white hover:bg-[#17AD4C] transition-all duration-200 cursor-pointer"
                      >
                        Buy <span className="hidden sm:inline">now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ProductDetails;
