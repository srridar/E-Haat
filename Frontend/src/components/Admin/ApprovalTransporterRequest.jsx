import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Mail,
  Phone,
  Clock,
  Banknote,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import useGetTransporterApprovalRequest from "@/hooks/adminHooks/useGetTransporterApprovalRequest";

const TransporterApprovalRequest = () => {
  const { data, loading } = useGetTransporterApprovalRequest();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-all text-sm font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Fleet Overview
            </button>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Carrier <span className="text-emerald-500 text-3xl opacity-80">Authentication</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium italic">
              Evaluating logistics nodes and carrier transit capabilities.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Truck size={20} className="text-emerald-500" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Active Applications</p>
              <span className="text-xl font-mono font-bold text-white leading-none">
                {data?.length?.toString().padStart(2, '0') || "00"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]">Syncing Logistics Database...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-[#111] rounded-[2rem] border border-white/5 p-20 text-center shadow-inner relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-emerald-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase italic tracking-tight">Fleet Synchronized</h2>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm font-medium">
                No external carriers are currently requesting authorization.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((transporter) => (
              <div
                key={transporter._id}
                className="group bg-[#161616] border border-white/5 rounded-[1.5rem] p-6 hover:bg-[#1C1C1C] hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">

                  {/* Carrier Identity */}
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-[#0A0A0A] border border-white/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:border-emerald-500/50 transition-all duration-300">
                      <Truck size={32} />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h2 className="font-black text-xl text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                          {transporter.name}
                        </h2>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">
                          Node ID: {transporter._id.slice(-8)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <Mail size={14} className="text-emerald-500/50" /> {transporter.email}
                        </span>
                        <span className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <Phone size={14} className="text-emerald-500/50" /> {transporter.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Specs & Pricing */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-center">
                    <div className="px-5 py-3 bg-[#0A0A0A] rounded-2xl border border-white/5 min-w-[140px]">
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-tighter mb-1">Class Type</p>
                      <p className="text-xs font-bold text-gray-300 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         {transporter.vehicle?.type || "General Logistics"}
                      </p>
                    </div>
                    
                    <div className="px-5 py-3 bg-[#0A0A0A] rounded-2xl border border-white/5 min-w-[140px]">
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-tighter mb-1">Rate Metric</p>
                      <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <Banknote size={14} className="text-emerald-500" />
                        {transporter.pricePerKm ? `रू ${transporter.pricePerKm} / KM` : "Negotiable"}
                      </p>
                    </div>
                  </div>

                  {/* Terminal Action */}
                  <div className="flex items-center lg:flex-col lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                    <button
                      onClick={() => navigate(`/admin/view-transporter-details/${transporter._id}`)}
                      className="flex-1 lg:w-48 flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all active:scale-95 group/btn"
                    >
                      Audit Carrier <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 px-2">
                       <Clock size={12} className="text-gray-600" />
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">
                         Request: {new Date(transporter.createdAt).toLocaleDateString()}
                       </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-600/[0.03] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default TransporterApprovalRequest;