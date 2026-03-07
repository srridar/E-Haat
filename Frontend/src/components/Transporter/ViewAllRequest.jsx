import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, Filter, MapPin, Package, 
  IndianRupee, Calendar, ChevronRight, Search,
  ArrowRight
} from "lucide-react";
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";

const ViewAllRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await axios.get(`${TRANSPORTER_API_END_POINT}/get-all-requests`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setRequests(res.data.allrequest || []);
          
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRequests();
  }, []);

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(req => req.status === filter);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Incoming Requests</h1>
                <p className="text-xs text-slate-500 font-medium">{filteredRequests.length} available loads</p>
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {["all", "pending", "accepted"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 w-full bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
            <p className="text-slate-500 text-sm">Try changing your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => navigate(`/transporter/view-request/${req._id}`)}
                className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Price Tag */}
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-[1.5rem] font-bold text-sm shadow-lg">
                  ₹{req.offeredPrice}
                </div>

                <div className="flex flex-col h-full">
                  {/* Item Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight truncate w-48">
                        {req.itemDescription}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                        Weight: {req.weightKg} kg
                      </p>
                    </div>
                  </div>

                  {/* Route Visual */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 mb-6">
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Pickup</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{req.pickupLocation.district}</p>
                    </div>
                    <div className="px-4 flex flex-col items-center">
                      <div className="h-[2px] w-8 bg-slate-200 relative">
                        <ArrowRight size={14} className="absolute -top-[6px] right-0 text-slate-300" />
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Dropoff</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{req.destinationLocation.district}</p>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-xs font-semibold">
                          {new Date(req.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-orange-600 group-hover:translate-x-1 transition-transform">
                      View details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewAllRequest;