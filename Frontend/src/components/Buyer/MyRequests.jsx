import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Calendar, Truck, MapPin, Package, IndianRupee, Clock, ChevronRight } from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BUYER_API_END_POINT}/my-requests`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.allmyrequest);
        console.log(requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      accepted: "bg-blue-50 text-blue-700 border-blue-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
      in_transit: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };


  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 w-full bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">

      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Transport <span className="text-blue-600">Requests</span>
          </h1>
          <p className="text-gray-500 mt-2">Track and manage your active logistics and deliveries.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No transport requests found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >

                <div className={`h-1 w-full ${req.status === 'delivered' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <Truck size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {req.transporter?.companyName || "Awaiting Assignment"}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                          <Clock size={12} className="mr-1" />
                          ID: {req._id.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyles(req.status)}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {req.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Middle Row: Route & Cargo */}
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Route Visualizer */}
                    <div className="space-y-4 relative">
                      <div className="absolute left-[11px] top-[14px] bottom-[14px] w-[2px] bg-dashed bg-gray-200 border-l-2 border-dashed" />

                      <div className="flex items-start gap-3 relative z-10">
                        <div className="mt-1 w-[24px] h-[24px] rounded-full bg-white border-4 border-blue-500" />
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Pickup</p>
                          <p className="text-sm font-medium text-gray-700">{req.pickupLocation.municipality}, {req.pickupLocation.district}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 relative z-10">
                        <div className="mt-1 w-[24px] h-[24px] rounded-full bg-white border-4 border-emerald-500" />
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Destination</p>
                          <p className="text-sm font-medium text-gray-700">{req.destinationLocation.municipality}, {req.destinationLocation.district}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Cargo</p>
                          <p className="text-sm font-semibold text-gray-700 truncate w-32">{req.itemDescription}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <IndianRupee size={18} className="text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Price</p>
                          <p className="text-sm font-bold text-gray-900">₹{req.offeredPrice}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Est. Date</p>
                          <p className="text-sm font-semibold text-gray-700">{new Date(req.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-[18px] text-[10px] font-bold text-gray-400">KG</div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Weight</p>
                          <p className="text-sm font-semibold text-gray-700">{req.weightKg} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action (Optional) */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => navigate(`/product/create-order/${req._id}`)}
                      className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                    >
                      {req.status === "accepted" ? (
                        "Create Complete Order"
                      ) : (
                        <>
                          View Full Details
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;