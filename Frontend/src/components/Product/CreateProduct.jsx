import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Plus, RotateCcw, PackagePlus } from 'lucide-react';
import axios from "axios";
import { PRODUCT_API_END_POINT } from "@/utils/constants";
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    brand: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }));
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (updated.length <= 5) {
        setErrors((e) => ({ ...e, images: "" }));
      }
      return updated;
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setErrors({});
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.name.trim())
      validationErrors.name = "Product name is required";

    if (!formData.brand.trim())
      validationErrors.brand = "Brand is required";

    if (!formData.category)
      validationErrors.category = "Category is required";

    if (!formData.price || Number(formData.price) <= 0)
      validationErrors.price = "Price must be greater than 0";

    if (!formData.stock || Number(formData.stock) <= 0)
      validationErrors.stock = "Quantity must be greater than 0";

    if (images.length === 0)
      validationErrors.images = "At least one image is required";

    if (images.length > 3)
      validationErrors.images = "Maximum 3 images allowed";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      images.forEach((img) => data.append("images", img));
      console.log(data);

      const res = await axios.post(`${PRODUCT_API_END_POINT}/create-product`, data, { withCredentials: true });

      if (res.data.success) {
        navigate("/seller/my-products");
      }
    } catch (err) {
      console.error("Product creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-500 tracking-tight flex items-center gap-3">
              <PackagePlus className="text-orange-600" />
              Create New Product
            </h1>
            <p className="text-slate-500 mt-1">Fill in the details to list your item in the marketplace.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 border-slate-50">General Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Organic Gala Apples"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    required
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Organic Gala Apples"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    required
                  />
                  {errors.brand && <span className="text-red-500 text-sm">{errors.brand}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Provide a detailed description of the product..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  />
                  {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 border-slate-50">Media</h2>

              <div className="relative group cursor-pointer">
                <div className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 group-hover:bg-emerald-50/50 group-hover:border-emerald-300 transition-all duration-300">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">Maximum 5 images • JPG, PNG, WebP</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden ring-1 ring-slate-200">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 border-slate-50">Inventory & Pricing</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select Category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>

                {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rs.</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}
              </div>

            </section>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;