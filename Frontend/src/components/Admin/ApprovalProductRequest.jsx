import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Clock, CheckCircle2,  XCircle, Tag, ShieldAlert,  Eye, Loader2 
} from "lucide-react";
import useGetProductApprovalRequest from "@/hooks/adminHooks/useGetProductApprovalRequest";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";

const ProductApprovalRequest = () => {
  const { data, loading, refetch } = useGetProductApprovalRequest();
  const navigate = useNavigate();

  const handleAction = async (productId, action) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/product-approval-action/${productId}`,
        { action },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Inventory updated: ${action}ed`);
        refetch();
      }
    } catch (error) {
      console.error("Approval action failed:", error);
      toast.error("Protocol failure: Could not update status");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all text-sm font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Core
            </button>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Product <span className="text-indigo-500 text-3xl opacity-80">Moderation</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Validate incoming inventory data before terminal broadcast.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Package size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Pending Sync</p>
              <span className="text-xl font-mono font-bold text-white leading-none">
                {data?.length?.toString().padStart(2, '0') || "00"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Decrypting Inventory Data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-[#111] rounded-[2rem] border border-white/5 p-20 text-center shadow-inner">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase italic tracking-tight">System Optimized</h2>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm font-medium">
              All product signals have been processed. Queue is currently empty.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((product) => (
              <div
                key={product._id}
                className="group relative bg-[#161616] border border-white/5 rounded-[1.5rem] p-5 hover:bg-[#1C1C1C] hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  
                  {/* Product Details */}
                  <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="relative w-24 h-24 shrink-0">
                      <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                      <div className="relative w-full h-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 p-1">
                        {product.images?.[0] || product.image ? (
                          <img 
                            src={product.images?.[0] || product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <ShieldAlert size={32} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="font-black text-xl text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                          {product.name}
                        </h2>
                        <span className="text-[10px] font-mono text-gray-600">ID: {product._id.slice(-6).toUpperCase()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <Tag size={10} /> {product.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          <Clock size={12} className="text-gray-600" /> 
                          Detected: {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {product.sellerName && (
                        <p className="text-[11px] text-gray-400 font-medium">
                          ORIGIN SENDER: <span className="text-indigo-300 font-bold uppercase italic">{product.sellerName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terminal Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button 
                      onClick={() => navigate(`/admin/view-product-details/${product._id}`)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      Analyze <Eye size={16} />
                    </button>
                    
                    <button 
                      onClick={() => handleAction(product._id, "reject")}
                      className="group/btn p-3.5 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                      title="Abort Signal"
                    >
                      <XCircle size={22} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ProductApprovalRequest;