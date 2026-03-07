import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Package, Truck, CheckCircle2, Clock, ShoppingBag, User, Phone, ChevronRight, Star } from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";


const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${BUYER_API_END_POINT}/get-all-orders`, { withCredentials: true });
      if (res.data.success) {
        setOrders(res.data.orderedProducts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);


  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === 'shipped') return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === 'pending') return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-40 w-full bg-slate-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">No orders yet</h2>
        <p className="text-slate-500 mt-2 max-w-xs">Your shopping cart is waiting to be filled with fresh produce!</p>
        <button onClick={() => navigate("/product/all")} className="mt-6 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-slate-500 font-medium">Track and manage your E-Haat purchases</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
          <span className="text-emerald-700 font-bold text-sm">{orders.length} Total Orders</span>
        </div>
      </header>

      <div className="space-y-6">
        {orders.map((item) => (
          <div
            key={item.orderId}
            onClick={() => navigate(`/buyer/order-tracking/${item.orderId}`)}
            className="group bg-white border border-slate-100 rounded-[2rem] p-2 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
          >
            <div className="p-6">
              {/* Top Row: Product & Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <Package size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {item.productName}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      ID: #{item.orderId.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-tighter ${getStatusStyles(item.orderStatus)}`}>
                  {item.orderStatus?.toLowerCase() === 'delivered' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {item.orderStatus}
                </div>
              </div>

              {/* Middle Row: Financials */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Unit Price</p>
                  <p className="text-slate-900 font-bold">Rs. {item.productPrice}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Quantity</p>
                  <p className="text-slate-900 font-bold">{item.quantity} Units</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Net Total</p>
                  <p className="text-emerald-600 font-black text-lg">Rs. {item.totalPrice}</p>
                </div>
                <div className="flex items-end lg:justify-end">
                  <button className="text-sm font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors">
                    View Invoice <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Seller & Ratings */}
              <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Seller Info */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.seller?.name}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
                    <Phone size={14} />
                    <span>{item.seller?.phone}</span>
                  </div>
                </div>

                {/* Rating Actions */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors
                    ${item.isSellerRated ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <Star size={12} fill={item.isSellerRated ? "currentColor" : "none"} />
                    Seller {item.isSellerRated ? 'Rated' : 'Pending'}
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors
                    ${item.isTransportRated ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <Truck size={12} fill={item.isTransportRated ? "currentColor" : "none"} />
                    Logistics {item.isTransportRated ? 'Rated' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllOrders;