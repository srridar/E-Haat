import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Package, MoreVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const GetAllProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/products`, { withCredentials: true });
      if (res.data.success) {
        setAllProducts(res.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const stats = {
    total: allProducts.length,
    approved: allProducts.filter(p => p.isVerified).length,
    pending: allProducts.filter(p => !p.isVerified && p.isActive).length,
    rejected: allProducts.filter(p => !p.isActive).length,
  };

  const getStatusBadge = (product) => {
    if (!product.isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle size={14} /> Rejected
        </span>
      );
    }
    if (product.isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={14} /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={14} /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Management</h1>
              <p className="text-slate-500 text-sm">Monitor and control your marketplace inventory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
               <Filter size={16} /> Filter
             </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryCard title="Total Inventory" value={stats.total} icon={<Package className="text-blue-600" />} />
          <SummaryCard title="Live Products" value={stats.approved} icon={<CheckCircle className="text-emerald-600" />} />
          <SummaryCard title="Needs Review" value={stats.pending} icon={<Clock className="text-amber-600" />} />
          <SummaryCard title="Archived/Rejected" value={stats.rejected} icon={<XCircle className="text-red-600" />} />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Seller</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-4 bg-slate-50/30 h-16"></td>
                    </tr>
                  ))
                ) : allProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={40} className="opacity-20" />
                        <p>No products found in the database</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{product.name}</td>
                      <td className="px-6 py-4 text-slate-600">{product.seller?.name || "Anonymous"}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(product)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/view-product-details/${product._id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {!product.isVerified && product.isActive && (
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded transition-colors">Approve</button>
                              <button className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors">Reject</button>
                            </div>
                          )}
                          <button className="p-2 text-slate-300">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Improved Summary Card with Icons */
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
  </div>
);

export default GetAllProduct;