import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineCloudArrowUp, HiOutlineXMark } from "react-icons/hi2";
import { compressImage } from "../../utils/imageCompressor";

const AddProduct = () => {
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        toast.error("Please upload at least one image.");
        setLoading(false);
        return;
      }

      // Compress all images in parallel before sending to server
      const compressedImages = await Promise.all(
        images.map((img) => compressImage(img))
      );

      const formData = new FormData();
      compressedImages.forEach((img) => formData.append("images", img));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);

      const { data } = await axios.post(
        backendUrl + "/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setImages([]);
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 p-3 md:p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Add Product</h2>

      <div className="bg-white border border-slate-200/80 rounded-xl px-6 md:px-8 py-8 max-w-4xl shadow-sm">
        {/* Image Upload */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Product Images{" "}
            <span className="text-slate-400 font-normal">(up to 5)</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
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
                htmlFor="product-images"
                className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#17AD4C] hover:bg-slate-50/50 transition-all"
              >
                <HiOutlineCloudArrowUp className="text-slate-400 text-xl" />
                <span className="text-[10px] text-slate-400 mt-1">Upload</span>
              </label>
            )}
            <input
              onChange={handleImageChange}
              type="file"
              id="product-images"
              accept="image/*"
              multiple
              hidden
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
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

          {/* Right Column */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-8 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#17AD4C] to-[#139841] hover:from-[#139841] hover:to-[#0f7d34] focus:outline-none focus:ring-2 focus:ring-[#17AD4C]/50 transition-all duration-200 shadow-lg shadow-green-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
