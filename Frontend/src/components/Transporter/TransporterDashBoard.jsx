import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Clock, CheckCircle2, 
  Star, AlertCircle, ChevronRight, LayoutDashboard,
  ClipboardList, ListChecks, ArrowUpRight
} from "lucide-react";
import axios from 'axios';
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";

const TransporterDashboard = () => {
  const [data, setData] = useState({
    totalDeliveries: 120,
    rating: 4.8,
    isAvailable: true,
    verificationStatus: "pending", 
    requestedOrders: 5,
    activeOrders: 2,
    completedOrders: 113
  });

  const [reqs, setReqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllTransRequests = async () => {
      try {
        const res = await axios.get(`${TRANSPORTER_API_END_POINT}/get-transport-req`, { 
          withCredentials: true 
        });
        if (res.data.success) {
          setReqs(res.data.requests || []);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    getAllTransRequests();
  }, []);

  const toggleAvailability = () => {
    if (data.verificationStatus !== "approved") return;
    setData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-1.5 bg-orange-500 rounded-lg shadow-orange-200 shadow-lg">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${data.isAvailable ? "text-green-600" : "text-slate-400"}`}>
                {data.isAvailable ? "Online" : "Offline"}
              </span>
              <button
                onClick={toggleAvailability}
                disabled={data.verificationStatus !== "approved"}
                className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                  data.isAvailable ? "bg-green-500 shadow-inner" : "bg-slate-300"
                } ${data.verificationStatus !== "approved" && "opacity-50 cursor-not-allowed"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    data.isAvailable ? "translate-x-5" : ""
                }`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Verification Alert */}
        {data.verificationStatus !== "approved" && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Action Required</p>
              <p className="text-xs text-amber-700">Account verification is in progress. Some features are currently locked.</p>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => navigate('/transporter/all-requests')}
            className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ClipboardList size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Browse Requests</h4>
                <p className="text-xs text-slate-500">Find new delivery opportunities</p>
              </div>
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
          </button>

          <button 
            onClick={() => navigate('/transporter/my-orders')}
            className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ListChecks size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Manage Orders</h4>
                <p className="text-xs text-slate-500">Track and update active deliveries</p>
              </div>
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Pending Requests" value={data.requestedOrders} icon={<Clock />} color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="In Transit" value={data.activeOrders} icon={<Package />} color="text-orange-500" bg="bg-orange-50" />
          <StatCard label="Completed" value={data.completedOrders} icon={<CheckCircle2 />} color="text-emerald-500" bg="bg-emerald-50" />
          <StatCard label="Trust Score" value={`${data.rating}/5`} icon={<Star />} color="text-yellow-500" bg="bg-yellow-50" />
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Request Activity</h3>
              <p className="text-xs text-slate-500 font-medium">Last 5 incoming requests</p>
            </div>
            <button 
              onClick={() => navigate('/transporter/all-requests')}
              className="text-sm font-bold text-orange-600 hover:text-orange-700 px-4 py-2 hover:bg-orange-50 rounded-xl transition-all"
            >
              See All Activity
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {reqs.length > 0 ? (
              reqs.slice(0, 5).map((req) => (
                <div 
                  key={req._id} 
                  onClick={() => navigate(`/transporter/view-request/${req._id}`)}
                  className="group px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex gap-5 items-center">
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Package size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">ID: {req._id?.slice(-6).toUpperCase()}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-tight">New</span>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                        <span className="text-slate-400">{req.pickupLocation?.district}</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-slate-800">{req.destinationLocation?.district}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-900">₹{req.offeredPrice || "---"}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Budget</p>
                    </div>
                    <div className="p-2 rounded-xl border border-slate-100 text-slate-400 group-hover:border-orange-200 group-hover:text-orange-500 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <div className="p-4 bg-slate-50 rounded-full mb-3">
                   <Package size={40} className="opacity-20" />
                </div>
                <p className="text-sm font-medium">No pending requests at the moment</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className={`mb-4 w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

export default TransporterDashboard;