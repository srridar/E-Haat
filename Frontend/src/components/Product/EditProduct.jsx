import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Package } from "lucide-react"; // Optional: npm install lucide-react
import axios from "axios";
import { PRODUCT_API_END_POINT } from "@/utils/constants";
import { SELLER_API_END_POINT } from "@/utils/constants";

const EditProduct = () => {
    const { productId } = useParams();
    const id= productId;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        unit: "",
        brand: "",
        isActive: true,
    });

    const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Food", "Clothing", "Furniture", "Electronics", "Other"];
    const units = ["Kg", "Liter", "Piece", "Pack", "Gram", "Dozen", "Other"];

    useEffect(() => {
        const fetchProduct = async () => {

            try {
                const res = await axios.get(`${PRODUCT_API_END_POINT}/get-product/${id}`, { withCredentials: true });        
                const product = res.data.product;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price || "",
                    category: product.category || "",
                    stock: product.stock || "",
                    unit: product.unit || "",
                    brand: product.brand || "",
                    isActive: product.isActive ?? true,
                });
            } catch (error) {
                console.error(error);
                alert("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.category) {
            return alert("Please fill required fields");
        }
        try {
            setSaving(true);
            await axios.put(`${SELLER_API_END_POINT}/edit-product/${productId}`, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            }, { withCredentials: true }); 
            navigate(`/products/${productId}`);
        } catch (error) {
            alert(error?.response?.data?.message || "Update failed");
        } finally {
            setSaving(false); 
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-2 text-blue-600" />
                <p className="font-medium">Loading Product Details...</p>
            </div>
        );
    }

    const inputClass = "w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700";
    const labelClass = "text-sm font-semibold text-slate-600 ml-1";

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
                    </button>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Edit Product</h1>
                </div>
                <div className="hidden md:block">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Package className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Info Card */}
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Organic Red Apples"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Description *</label>
                            <textarea
                                rows="4"
                                name="description"
                                placeholder="Describe the product features..."
                                value={formData.description}
                                onChange={handleChange}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Brand</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="Brand name"
                                value={formData.brand}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-2xl grid grid-cols-2 gap-4 md:col-span-2">
                            <div>
                                <label className={labelClass}>Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Stock Level</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                    <select name="unit" value={formData.unit} onChange={handleChange} className={`${inputClass} w-32`}>
                                        {units.map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">Product visibility (Active)</span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:active:scale-100 transition-all shadow-lg shadow-blue-200"
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" /> Update Product</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;