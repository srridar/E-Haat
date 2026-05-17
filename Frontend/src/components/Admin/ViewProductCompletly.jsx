import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ADMIN_API_END_POINT } from "@/utils/constants";
import {
  ArrowLeft, Tag, XCircle,
  CheckCircle2, AlertCircle, User,
  Eye, Archive, ShieldCheck, Trash2,
  Package, Star, Phone, Mail
} from 'lucide-react';

const ViewProductCompletly = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/product-approval/${id}`, { withCredentials: true });
      if (res.data.success) {
        setProduct(res.data.product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyProduct = async (productId, action) => {
    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/verify-product`, { productId, action }, { withCredentials: true });
      if (res.data.success) {
        fetchProductDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const blockAndUnblockProduct = async (productId, action) => {
    try {
      const res = await axios.put(`${ADMIN_API_END_POINT}/block-unblock-product`, { id: productId, action }, { withCredentials: true });
      return res.data.success ? { success: true, message: res.data.message } : { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0].url);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-gray-400">
        <Package size={64} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">Product not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-400 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Back Button & Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-start gap-5">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 p-2.5 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
                <Tag size={14} /> {product.category}
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">{product.name}</h1>
              <p className="text-gray-500 font-mono text-sm mt-1">UUID: {product._id}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all" title="Delete Product">
              <Trash2 size={20} />
            </button>

            <button
              onClick={async () => {
                const action = product.isBlocked ? "unblock" : "block";
                const res = await blockAndUnblockProduct(product._id, action);
                if (res.success) setProduct(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${
                product.isBlocked
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              }`}
            >
              {product.isBlocked ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {product.isBlocked ? "Unblock Product" : "Block Product"}
            </button>

            {!product.isVerified && (
              <>
                <button onClick={() => verifyProduct(product._id, 'approved')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
                  <ShieldCheck size={18} /> Approve
                </button>
                <button onClick={() => verifyProduct(product._id, 'rejected')} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-bold border border-gray-700 transition-all">
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e1e1e] p-3 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
              <div className="aspect-square rounded-2xl bg-[#121212] flex items-center justify-center border border-gray-800/50">
                <img
                  src={activeImage || 'https://via.placeholder.com/600'}
                  alt="Product"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all ${
                    activeImage === img.url ? 'border-indigo-500 scale-105' : 'border-gray-800 grayscale hover:grayscale-0'
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover rounded-lg" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Price & Stock Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Pricing</span>
                <div className="text-3xl font-black text-white mt-1">
                  Rs. {product.price.toLocaleString()} 
                  <span className='text-sm text-gray-500 font-medium ml-2'>/ {product.unit}</span>
                </div>
              </div>

              <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Inventory</span>
                <div className={`text-3xl font-black flex items-center gap-2 mt-1 ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <Archive size={24} /> {product.stock}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Eye size={20} className="text-indigo-400" /> Description
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                {product.description}
              </p>
            </div>

            {/* Technical Specs & Seller Info */}
            <div className="bg-indigo-500/5 rounded-3xl p-8 border border-indigo-500/10">
              <h3 className="text-indigo-400 font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                <Package size={16} /> Detailed Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <SpecItem label="Brand" value={product.brand} />
                <SpecItem label="Quality Rating" value={`⭐ ${product.rating} (${product.totalRatings} Reviews)`} />
                
                <div className="md:col-span-2 border-t border-gray-800 my-2 pt-6">
                   <h4 className="text-gray-300 font-bold mb-4 flex items-center gap-2">
                     <User size={16} className="text-indigo-400" /> Seller Information
                   </h4>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-indigo-400 font-bold">
                         {product.seller?.name?.charAt(0)}
                       </div>
                       <span className="text-white font-semibold">{product.seller?.name}</span>
                     </div>
                     <div className="flex flex-wrap gap-4 text-xs">
                       <span className="flex items-center gap-1.5 text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                         <Mail size={12} /> {product.seller?.email}
                       </span>
                       <span className="flex items-center gap-1.5 text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                         <Phone size={12} /> {product.seller?.phone}
                       </span>
                     </div>
                   </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-gray-800">
                    <span className="text-gray-500 text-sm">System Status</span>
                    <span className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full text-xs border ${
                      product.isBlocked ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                      product.isVerified ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {product.isVerified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      {product.isBlocked ? "Blocked" : product.isVerified ? "Verified" : "Pending Approval"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Toggle Section */}
            <div className="flex items-center justify-between p-5 bg-[#1e1e1e] border border-gray-800 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${product.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-600'}`} />
                <span className="font-bold text-gray-300">
                  Market Visibility: <span className={product.isActive ? 'text-emerald-400' : 'text-gray-500'}>{product.isActive ? 'Public' : 'Hidden'}</span>
                </span>
              </div>
              <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                Toggle Visibility
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


const SpecItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{label}</span>
    <span className="text-gray-200 font-semibold">{value}</span>
  </div>
);

export default ViewProductCompletly;