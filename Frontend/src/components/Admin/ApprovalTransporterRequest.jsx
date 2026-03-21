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
  AlertCircle 
} from "lucide-react";
import useGetTransporterApprovalRequest from "@/hooks/adminHooks/useGetTransporterApprovalRequest";

const TransporterApprovalRequest = () => {
  const { data, loading } = useGetTransporterApprovalRequest();
  const navigate = useNavigate();


  return (
    <div className="max-w-5xl mx-auto p-5 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors text-sm font-medium mb-2"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Transporter Requests</h1>
          <p className="text-sm text-gray-500">Verify logistics partners and vehicle credentials.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2">
          <Truck size={18} className="text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">{data?.length || 0} New Applications</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-400 font-medium">Loading logistics data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-gray-300" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">No Pending Carriers</h2>
          <p className="text-gray-500">All transporter applications have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((transporter) => (
            <div
              key={transporter._id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:border-emerald-200 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Left: Basic Info & Contact */}
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Truck size={28} />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h2 className="font-bold text-lg text-gray-800 leading-none">
                        {transporter.name}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                        Carrier ID: {transporter._id.slice(-6)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={14} className="text-gray-400" /> {transporter.email}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={14} className="text-gray-400" /> {transporter.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Vehicle & Price Badges */}
                <div className="flex flex-wrap items-center gap-3 md:pl-20 lg:pl-0">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Vehicle Type</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Truck size={14} /> {transporter.vehicle?.type || "Standard"}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Rate / KM</p>
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <Banknote size={14} /> 
                      {transporter.pricePerKm ? `Rs. ${transporter.pricePerKm}` : "Quote Req."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center lg:flex-col lg:justify-center gap-3">
                  <button 
                    onClick={() => navigate(`/admin/view-transporter-details/${transporter._id}`)}
                    className="flex-1 lg:w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                  >
                    Review & Verify <ChevronRight size={16} />
                  </button>
                  <p className="hidden lg:block text-[10px] text-gray-400 font-medium">
                    Requested {new Date(transporter.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransporterApprovalRequest;