import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, ChevronRight, Tag } from "lucide-react";
import useGetProductApprovalRequest from "@/hooks/adminHooks/useGetProductApprovalRequest";
import { ADMIN_API_END_POINT } from "@/utils/constants";

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
        refetch();
      }
    } catch (error) {
      console.error("Approval action failed:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 mb-8 px-2">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-200 hover:text-orange-600 transition-colors text-md font-medium mb-2"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Moderation</h1>
          <p className="text-sm text-gray-500">Review new product listings before they go live on the marketplace.</p>
        </div>

        <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex items-center gap-2">
          <Package size={18} className="text-orange-600" />
          <span className="text-sm font-bold text-orange-700">{data?.length || 0} Pending Items</span>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-400 font-medium">Scanning inventory...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-gray-300" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Queue is Clear</h2>
          <p className="text-gray-500">No new products are waiting for approval right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Product Thumbnail & Info */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0 shadow-inner">
                    {product.images?.[0] || product.image ? (
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <Package className="text-gray-300" size={32} />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="font-bold text-lg text-gray-800 leading-tight">
                      {product.name}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-tighter">
                        <Tag size={12} /> {product.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} /> 
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {product.sellerName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Seller: <span className="font-medium text-gray-700">{product.sellerName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => navigate(`/admin/view-product-details/${product._id}`)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all"
                  >
                    View & Approve <ChevronRight size={16} />
                  </button>
                  
                  <button 
                    onClick={() => handleAction(product._id, "reject")}
                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    title="Reject Listing"
                  >
                    <XCircle size={22} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductApprovalRequest;