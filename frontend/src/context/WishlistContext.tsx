import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import axios from "axios";
import { AdminContext } from "./AdminContext";

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: { url: string; publicId: string }[];
  isActive: boolean;
}

interface WishlistContextType {
  wishlist: string[];
  wishlistProducts: Product[];
  loading: boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
  toggleWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType>(
  {} as WishlistContextType,
);

export const WishlistContextProvider = ({ children }: { children: ReactNode }) => {
  const { backendUrl } = useContext(AdminContext);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Reconcile and fetch product details when backendUrl or wishlist changes
  useEffect(() => {
    const reconcileProducts = async () => {
      // 1. Remove products that are no longer in the wishlist
      const activeProducts = wishlistProducts.filter((p) =>
        wishlist.includes(p._id),
      );

      // 2. Identify missing IDs that need fetching
      const currentIds = activeProducts.map((p) => p._id);
      const missingIds = wishlist.filter((id) => !currentIds.includes(id));

      if (missingIds.length === 0) {
        if (activeProducts.length !== wishlistProducts.length) {
          setWishlistProducts(activeProducts);
        }
        return;
      }

      setLoading(true);
      try {
        const fetched = await Promise.all(
          missingIds.map(async (id) => {
            try {
              const res = await axios.get(`${backendUrl}/api/products/${id}`);
              if (res.data?.success) {
                return res.data.data as Product;
              }
            } catch (err) {
              console.error(`Error fetching product ${id} for wishlist:`, err);
              // Auto-remove invalid/deleted products from wishlist
              setWishlist((prev) => prev.filter((pId) => pId !== id));
            }
            return null;
          }),
        );

        const validFetched = fetched.filter((p): p is Product => p !== null);
        setWishlistProducts([...activeProducts, ...validFetched]);
      } catch (error) {
        console.error("Error reconciling wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      reconcileProducts();
    }
  }, [wishlist, backendUrl]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
    setWishlistProducts([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistProducts,
        loading,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
