import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  ExternalLink, Mail, Phone, Loader2, UserPlus 
} from "lucide-react";
import useGetSellerApprovalRequest from "@/hooks/adminHooks/useGetSellerApprovalRequest";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";

const SellerApprovalRequest = () => {
  const { data, loading, refetch } = useGetSellerApprovalRequest();
  const navigate = useNavigate();

  const handleAction = async (sellerId, action) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/seller-approval/${sellerId}`,
        { action },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Merchant protocol: ${action}ed`);
        refetch();
      }
    } catch (error) {
      console.error("Seller approval failed:", error);
      toast.error("Transmission error: Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all text-sm font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              System Core
            </button>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Seller <span className="text-indigo-500 text-3xl opacity-80">Onboarding</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium italic">
              Vetting new merchant nodes for marketplace integration.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <UserPlus size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Pending Verification</p>
              <span className="text-xl font-mono font-bold text-white leading-none">
                {data?.length?.toString().padStart(2, '0') || "00"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Interface Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Retrieving Merchant Profiles...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-[#111] rounded-[2rem] border border-white/5 p-20 text-center shadow-inner relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-indigo-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase italic tracking-tight">Queue Clear</h2>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm font-medium">
                No merchant signals are currently awaiting authentication.
              </p>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((seller) => (
              <div
                key={seller._id}
                className="group bg-[#161616] border border-white/5 rounded-[1.5rem] p-6 hover:bg-[#1C1C1C] hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                  {/* Profile Signal */}
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-[#0A0A0A] border border-white/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 group-hover:border-indigo-500/50 group-hover:text-white transition-all shadow-inner">
                      {seller.name.charAt(0)}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h2 className="font-black text-xl text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                          {seller.name}
                        </h2>
                        <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                          New Signal
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Mail size={14} className="text-indigo-500/50" /> {seller.email}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Phone size={14} className="text-indigo-500/50" /> {seller.phone}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                          <Clock size={14} className="opacity-50" />
                          Logged: {new Date(seller.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => navigate(`/admin/view-seller-details/${seller._id}`)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-[#222] border border-white/5 text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all active:scale-95"
                    >
                      Audit Profile <ExternalLink size={14} />
                    </button>

                    <button
                      onClick={() => handleAction(seller._id, "reject")}
                      className="group/btn p-3 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-all"
                      title="Abort Onboarding"
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

      {/* Background Decorative Accent */}
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};

export default SellerApprovalRequest;