import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Package, CheckCircle2, Info, 
  XCircle, Truck, PackageCheck 
} from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/order/${id}`, { withCredentials: true });
      if (res.data.success) 
        setOrder(res.data.order);

      console.log(res.data.order)
    } catch (error) {
      console.error("Error fetching order details", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      const res = await axios.put(`${ADMIN_API_END_POINT}/update-order-status/${id}`, { status: newStatus }, { withCredentials: true });
      if (res.data.success) {
        toast.success(`Order ${newStatus} successfully!`);
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-bold animate-pulse tracking-widest uppercase text-xs">Syncing Order Data...</p>
      </div>
    </div>
  );

  if (!order) return <div className="p-20 text-center font-bold text-gray-500">Order Not Found</div>;

  return (
    <div className="min-h-screen bg-[#f7f6f4] pb-12">
      {/* Header Bar */}
      <div className="bg-[#fafafa] border-b border-gray-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-black">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">ORDER # {order._id.slice(-6).toUpperCase()}</h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {order.status === "pending" && (
                <>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(id, "accepted")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 size={18} /> Accept
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(id, "rejected")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-rose-100 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}

              {order.status === "accepted" && (
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus(id, "picked")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Truck size={18} /> Mark Picked
                </button>
              )}

              {order.status === "picked" && (
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus(id, "delivered")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <PackageCheck size={18} /> Complete Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <OrderProgress currentStatus={order.status} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Package size={18} className="text-indigo-500" /> Package Contents
                </h3>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{order.products.length} ITEMS</span>
              </div>
              <div className="p-6 divide-y divide-gray-50">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 group hover:bg-gray-50/50 transition-all px-2 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{item.product?.name || "Product Name"}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                          Seller: {item.seller?.name || "Verified Merchant"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">Rs. {item.product?.price?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocationCard title="Pickup Source" data={order.deliveryLocation.pickupLocation} color="blue" />
              <LocationCard title="Final Destination" data={order.deliveryLocation.destinationLocation} color="green" />
            </div>
          </div>

     
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-8">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="font-mono font-bold">Rs. {order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Shipping Fee</span>
                  <span className="font-mono font-bold">Rs. {order.deliveryCost?.toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-slate-800 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-tighter">Total Payable</span>
                  <span className="text-3xl font-black tracking-tighter text-white">Rs. {order.totalCost?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Info size={14} /> Trust Indicators
              </h3>
              <div className="space-y-4">
                <RatingRow label="Seller Reputation" status={order.isSellerRated} />
                <RatingRow label="Product Quality Check" status={order.isProductRated} />
                <RatingRow label="Courier Performance" status={order.isTransporterRated} />
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed italic">
                Notice: All status changes are recorded in the audit log with the current admin timestamp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-blue-50 text-blue-700 border-blue-200',
    picked: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${styles[status] || 'bg-gray-50'}`}>
      {status}
    </span>
  );
};

const OrderProgress = ({ currentStatus }) => {
  const steps = ["pending", "accepted", "picked", "delivered"];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
              idx <= currentIndex ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-300'
            }`}>
              {idx < currentIndex ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
            </div>
            <p className={`absolute -bottom-7 text-[9px] font-black uppercase tracking-tighter whitespace-nowrap ${
              idx <= currentIndex ? 'text-indigo-600' : 'text-gray-300'
            }`}>{step}</p>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-700 ${
              idx < currentIndex ? 'bg-indigo-600' : 'bg-gray-100'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const LocationCard = ({ title, data, color }) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-t-4 transition-transform hover:scale-[1.02] ${
    color === 'blue' ? 'border-t-indigo-500' : 'border-t-emerald-500'
  }`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${color === 'blue' ? 'text-indigo-500' : 'text-emerald-600'}`}>
      {title}
    </p>
    <div className="flex gap-3">
      <MapPin size={18} className="text-gray-300 mt-1 shrink-0" />
      <div>
        <p className="font-black text-slate-800 leading-tight">{data?.landmark}</p>
        <p className="text-xs text-gray-500 font-bold mt-1 tracking-tight">
          {data?.municipality}, Ward {data?.ward}
        </p>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          {data?.district}, {data?.province}
        </p>
      </div>
    </div>
  </div>
);

const RatingRow = ({ label, status }) => (
  <div className="flex items-center justify-between group py-1">
    <span className={`text-[11px] font-bold ${status ? 'text-slate-800' : 'text-gray-300'}`}>{label}</span>
    <div className={`p-1 rounded-full ${status ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-200'}`}>
      <CheckCircle2 size={14} />
    </div>
  </div>
);

export default OrderDetail;