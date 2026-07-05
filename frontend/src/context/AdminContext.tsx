import { createContext, useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: { url: string; publicId: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashData {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCategories: number;
  latestProducts: Product[];
}

interface AdminContextType {
  aToken: string;
  setAToken: (token: string) => void;
  backendUrl: string;
  products: Product[];
  setProducts: (products: Product[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  totalProducts: number;
  setTotalProducts: (total: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  getAllProducts: (page?: number, limit?: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string, isActive: boolean) => Promise<void>;
  dashData: DashData | null;
  getDashData: () => Promise<void>;
  loading: boolean;
}

export const AdminContext = createContext<AdminContextType>(
  {} as AdminContextType,
);

const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [aToken, setAToken] = useState<string>(
    localStorage.getItem("aToken") || "",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllProducts = async (page: number = currentPage, limitVal: number = limit) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/products?isActive=all&page=${page}&limit=${limitVal}`
      );
      if (data.success) {
        if (data.data.products.length === 0 && page > 1) {
          getAllProducts(page - 1, limitVal);
          return;
        }
        setProducts(data.data.products);
        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.totalPages);
        setTotalProducts(data.data.pagination.totalProducts);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { data } = await axios.delete(backendUrl + `/api/products/${id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        toast.success(data.message);
        // Local state update for instant UI feedback
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setTotalProducts((prev) => Math.max(0, prev - 1));
        
        const remainingCount = products.length - 1;
        if (remainingCount === 0 && currentPage > 1) {
          getAllProducts(currentPage - 1, limit);
        } else {
          setTotalPages(Math.max(1, Math.ceil((totalProducts - 1) / limit)));
        }
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleProductActive = async (id: string, isActive: boolean) => {
    try {
      const { data } = await axios.put(
        backendUrl + `/api/products/${id}`,
        { isActive },
        { headers: { Authorization: `Bearer ${aToken}` } },
      );
      if (data.success) {
        toast.success("Product status updated.");
        // Local state update for instant UI feedback
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isActive } : p))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        setDashData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const value: AdminContextType = {
    aToken,
    setAToken,
    backendUrl,
    products,
    setProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    totalProducts,
    setTotalProducts,
    limit,
    setLimit,
    getAllProducts,
    deleteProduct,
    toggleProductActive,
    dashData,
    getDashData,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
