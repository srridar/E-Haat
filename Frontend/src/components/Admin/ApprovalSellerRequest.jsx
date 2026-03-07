import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink, Mail, Phone } from "lucide-react";
import useGetSellerApprovalRequest from "@/hooks/adminHooks/useGetSellerApprovalRequest";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const SellerApprovalRequest = () => {
  const { data, loading, refetch } = useGetSellerApprovalRequest();
  const navigate = useNavigate();

  const handleAction = async (sellerId, action) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/seller-approval-action/${sellerId}`,
        { action },
        { withCredentials: true }
      );

      if (res.data.success) {
        refetch();
      }
    } catch (error) {
      console.error("Seller approval failed:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 p-5">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium mb-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Seller Onboarding</h1>
          <p className="text-sm text-gray-500">Review and verify registration requests from new sellers.</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl flex items-center gap-2">
          <Clock size={16} className="text-amber-600" />
          <span className="text-sm font-bold text-amber-700">{data?.length || 0} Pending</span>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-400 font-medium">Fetching requests...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-gray-300" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">All caught up!</h2>
          <p className="text-gray-500">There are no pending seller approvals at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((seller) => (
            <div
              key={seller._id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Seller Info */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      {seller.name}
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">New</span>
                    </h2>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Mail size={14} className="text-gray-400" /> {seller.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Phone size={14} className="text-gray-400" /> {seller.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={14} className="text-gray-300" /> 
                        Requested {new Date(seller.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate(`/admin/view-seller-details/${seller._id}`)} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                  >
                    View Details <ExternalLink size={14} />
                  </button>

                  <button 
                    onClick={() => handleAction(seller._id, "reject")} 
                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    title="Quick Reject"
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

export default SellerApprovalRequest;