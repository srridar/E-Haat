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
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    if (product.isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle size={12} /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock size={12} /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
  
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl border border-gray-800 bg-[#1e1e1e] shadow-sm hover:bg-gray-800 transition-all text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Product Management</h1>
              <p className="text-gray-500 text-sm">Monitor and control your marketplace inventory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#1e1e1e] border border-gray-800 rounded-lg shadow-sm hover:bg-gray-800 transition-colors text-gray-300">
               <Filter size={16} /> Filter
             </button>
          </div>
        </div>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Total Inventory" value={stats.total} icon={<Package className="text-blue-400" />} color="blue" />
          <SummaryCard title="Live Products" value={stats.approved} icon={<CheckCircle className="text-emerald-400" />} color="emerald" />
          <SummaryCard title="Needs Review" value={stats.pending} icon={<Clock className="text-amber-400" />} color="amber" />
          <SummaryCard title="Archived/Rejected" value={stats.rejected} icon={<XCircle className="text-red-400" />} color="red" />
        </div>

     
        <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#252525] border-b border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Product Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Seller</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-6 bg-gray-800/10 h-16"></td>
                    </tr>
                  ))
                ) : allProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-24 text-gray-600">
                      <div className="flex flex-col items-center gap-3">
                        <Package size={48} className="opacity-10" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm opacity-60">Try adjusting your filters or add a new product.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-800/40 transition-colors group">
                      <td className="px-6 py-4">
                         <p className="font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">{product.name}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{product.seller?.name || "Anonymous"}</td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 bg-gray-800 px-2.5 py-1 rounded text-[10px] font-bold border border-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-400 font-medium">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(product)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => navigate(`/admin/view-product-details/${product._id}`)}
                            className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {!product.isVerified && product.isActive && (
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-md transition-colors">Approve</button>
                              <button className="px-3 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md transition-colors">Reject</button>
                            </div>
                          )}
                          <button className="p-2 text-gray-600 hover:text-gray-300 transition-colors">
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


const SummaryCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800 p-6 shadow-sm hover:border-gray-700 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</span>
        <div className={`p-2.5 rounded-xl ${colorMap[color] || "bg-gray-800 text-gray-400"}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</div>
    </div>
  );
};

export default GetAllProduct;