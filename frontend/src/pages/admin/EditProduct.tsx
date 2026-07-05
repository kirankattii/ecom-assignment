import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { compressImage } from "../../utils/imageCompressor";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: { url: string; publicId: string }[];
  isActive: boolean;
}

interface ImageItem {
  type: "existing" | "new";
  url?: string;
  publicId?: string;
  file?: File;
  id?: string;
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + `/api/products/${id}`,
        );
        if (data.success) {
          const p = data.data;
          setProduct(p);
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category);
          setPrice(String(p.price));
          setStock(String(p.stock));
          setImages(
            p.images.map((img: any) => ({
              type: "existing",
              url: img.url,
              publicId: img.publicId,
            }))
          );
        } else {
          toast.error("Product not found.");
          navigate("/product-list");
        }
      } catch (error: any) {
        toast.error("Failed to load product.");
        navigate("/product-list");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, backendUrl, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newItems: ImageItem[] = files.map((file) => ({
        type: "new",
        file,
        id: Math.random().toString(36).substring(2, 9),
      }));
      setImages((prev) => [...prev, ...newItems].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);

      // Separate existing and new images
      const keptExisting = images
        .filter((img) => img.type === "existing")
        .map((img) => ({ url: img.url, publicId: img.publicId }));

      const newFiles = images
        .filter((img) => img.type === "new")
        .map((img) => img.file!);

      formData.append("existingImages", JSON.stringify(keptExisting));

      if (newFiles.length > 0) {
        // Compress new files in parallel before sending to server
        const compressedNewFiles = await Promise.all(
          newFiles.map((file) => compressImage(file))
        );
        compressedNewFiles.forEach((file) => formData.append("images", file));
      }

      const { data } = await axios.put(
        backendUrl + `/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update product.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-[#17AD4C] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 p-3 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate("/product-list")}
          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <HiOutlineArrowLeft />
        </button>
        <h2 className="text-xl font-semibold text-slate-900">Edit Product</h2>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl px-6 md:px-8 py-8 max-w-4xl shadow-sm">
        {/* Images Upload & Gallery */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Product Images{" "}
            <span className="text-slate-400 font-normal">(up to 5)</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {images.map((img, index) => (
              <div
                key={img.type === "existing" ? img.publicId : img.id}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group"
              >
                <img
                  src={img.type === "existing" ? img.url : URL.createObjectURL(img.file!)}
                  alt={`product-${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-slate-900/80 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <HiOutlineXMark className="text-white text-xs" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label
                htmlFor="edit-product-images"
                className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#17AD4C] hover:bg-slate-50/50 transition-all"
              >
                <HiOutlineCloudArrowUp className="text-slate-400 text-xl" />
                <span className="text-[10px] text-slate-400 mt-1">Upload</span>
              </label>
            )}
            <input
              onChange={handleImageChange}
              type="file"
              id="edit-product-images"
              accept="image/*"
              multiple
              hidden
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Product Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#17AD4C] focus:ring-1 focus:ring-[#17AD4C]/20 focus:bg-white transition-all"
                type="text"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#17AD4C] focus:ring-1 focus:ring-[#17AD4C]/20 focus:bg-white transition-all"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Price (₹)
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#17AD4C] focus:ring-1 focus:ring-[#17AD4C]/20 focus:bg-white transition-all"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                onChange={(e) => setStock(e.target.value)}
                value={stock}
                className="bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#17AD4C] focus:ring-1 focus:ring-[#17AD4C]/20 focus:bg-white transition-all"
                type="number"
                min="0"
                placeholder="0"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#17AD4C] focus:ring-1 focus:ring-[#17AD4C]/20 focus:bg-white transition-all resize-none"
                placeholder="Write product description..."
                rows={5}
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#17AD4C] to-[#139841] hover:from-[#139841] hover:to-[#0f7d34] focus:outline-none focus:ring-2 focus:ring-[#17AD4C]/50 transition-all duration-200 shadow-lg shadow-green-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/product-list")}
            className="px-8 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;
