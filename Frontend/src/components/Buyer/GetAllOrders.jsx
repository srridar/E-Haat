import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  Truck,
  ChevronRight,
  MapPin,
  CreditCard,
  CalendarDays,
  Hash,
  ArrowUpRight,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { ORDER_API_END_POINT } from "@/utils/constants";

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${ORDER_API_END_POINT}/all-orders`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Order pipeline fetch failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusStyles = (status) => {
    const normalStatus = status?.toLowerCase();
    switch (normalStatus) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/10";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200/60 ring-blue-500/10";
      case "partially_shipped":
        return "bg-purple-50 text-purple-700 border-purple-200/60 ring-purple-500/10";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-500/10";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/10";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10";
    }
  };

  const getSellerOrderStatusStyle = (status) => {
    const normalStatus = status?.toLowerCase();
    switch (normalStatus) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "accepted":
      case "preparing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ready_for_pickup":
      case "picked_up":
      case "in_transit":
      case "out_for_delivery":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Skeleton Loading State Component
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="h-20 w-2/3 bg-slate-100 rounded-2xl animate-pulse" />
        {[1, 2].map((n) => (
          <div key={n} className="h-96 rounded-[2rem] bg-white border border-slate-200/60 p-6 space-y-6 animate-pulse">
            <div className="h-16 bg-slate-50 rounded-xl" />
            <div className="h-44 bg-slate-100/60 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  // Clean Empty State Illustration
  if (orders.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 bg-slate-50/40">
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center relative z-10">
            <ShoppingBag className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">No Purchases Found</h1>
        <p className="text-slate-500 mt-2 max-w-sm text-center text-sm leading-relaxed">
          Your procurement history manifest is completely empty. Let's find some assets to secure.
        </p>
        <button
          onClick={() => navigate("/product/all")}
          className="mt-8 bg-slate-950 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all duration-200"
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* INTERFACE CONTROL HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Procurement Panel</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">My Order Manifest</h1>
            <p className="text-sm text-slate-500 mt-1">Track cross-vendor fulfillment timelines and secure invoice records.</p>
          </div>
          <div className="inline-flex items-center bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm self-start sm:self-auto">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2.5" />
            <span className="text-sm font-bold text-slate-800">{orders.length} Global Units</span>
          </div>
        </div>

        {/* ORDER PIPELINE CARDS ITERATION */}
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-200/70 rounded-[2.2rem] shadow-sm hover:shadow-xl hover:shadow-slate-100/60 transition-all duration-300 overflow-hidden group"
            >
              
              {/* GLOBAL PASSPORT MASTER ROW */}
              <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100 relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* MASTER METADATA BLOCK */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Hash size={12} /> Global ID Stamp
                      </p>
                      <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                        #{order._id.slice(-12).toUpperCase()}
                      </h2>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <CalendarDays size={12} /> Logged Date
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* MASTER FINANCIALS & BADGES BLOCK */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-2xs">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Billing Architecture</p>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-0.5">{order.paymentMethod}</h4>
                    </div>

                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-2xs">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Escrow Settlement</p>
                      <h4 className={`text-xs font-bold uppercase tracking-wide mt-0.5 ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </h4>
                    </div>

                    <div className={`px-4 py-2.5 rounded-xl text-xs font-bold border capitalize shadow-2xs ring-4 ${getStatusStyles(order.overallStatus)}`}>
                      {order.overallStatus?.replace('_', ' ')}
                    </div>
                  </div>

                </div>
              </div>

              {/* VENDOR SHIPMENTS MATRIX LAYOUT */}
              <div className="p-6 sm:p-8 space-y-6 bg-white">
                <div className="space-y-5">
                  {order.sellerOrders?.map((sellerOrder) => (
                    <div
                      key={sellerOrder._id}
                      className="border border-slate-100 rounded-2xl bg-slate-50/30 overflow-hidden hover:border-slate-300/80 transition-colors"
                    >
                      
                      {/* SUB-DISPATCH LOGISTICS ROUTE CONTROL HEADER */}
                      <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-600 text-sm shadow-2xs">
                            {sellerOrder?.seller?.name?.slice(0, 2).toUpperCase() || "VN"}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fulfillment Channel</p>
                            <h3 className="font-bold text-slate-800 text-sm">{sellerOrder?.seller?.name}</h3>
                            <p className="text-xs text-slate-500">{sellerOrder?.seller?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wide ${getSellerOrderStatusStyle(sellerOrder.status)}`}>
                            {sellerOrder.status?.replace('_', ' ')}
                          </span>

                          <button
                            onClick={() => navigate(`/buyer/order-details/${sellerOrder._id}`)}
                            className="bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 shadow-2xs p-2 rounded-xl text-slate-600 hover:text-white transition-all duration-200"
                            title="Inspect Ledger"
                          >
                            <ArrowUpRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* INDIVIDUAL MERCHANDISE LINE ITEMS */}
                      <div className="p-5 space-y-4">
                        {sellerOrder.products?.map((item) => (
                          <div
                            key={item._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-xl shadow-2xs group/item"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-indigo-500 group-hover/item:scale-105 transition-transform duration-200">
                                <Package size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item?.product?.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                  <span>Qty: <strong className="text-slate-700">{item.quantity}</strong></span>
                                  <span className="text-slate-300">•</span>
                                  <span>Unit: <strong className="text-slate-700">Rs {item.price.toLocaleString()}</strong></span>
                                </div>
                              </div>
                            </div>
                            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Line Price</p>
                              <h5 className="text-base font-bold text-slate-900">Rs {item.subtotal?.toLocaleString()}</h5>
                            </div>
                          </div>
                        ))}

                        {/* HIGHWAY DELIVERY TRACKING LOCATION ACCENT */}
                        <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4 flex gap-3">
                          <MapPin className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Routing Destination Target</p>
                            <p className="text-xs text-slate-700 font-medium mt-1">
                              {sellerOrder?.deliveryLocation?.municipality}, {sellerOrder?.deliveryLocation?.district}, {sellerOrder?.deliveryLocation?.province}
                            </p>
                            {(sellerOrder?.deliveryLocation?.ward || sellerOrder?.deliveryLocation?.landmark) && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Ward {sellerOrder?.deliveryLocation?.ward} / Landmark: {sellerOrder?.deliveryLocation?.landmark}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ACTION ROUTING PILL BAR */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100/80">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Truck size={14} className="text-slate-400" />
                            <span>Segment Logistics Overhead: <strong className="text-slate-800">Rs {sellerOrder.deliveryCost}</strong></span>
                          </div>
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="text-xs text-slate-400 text-right hidden sm:block">Channel Total:</span>
                            <span className="text-base font-black text-slate-900">Rs {sellerOrder.totalAmount?.toLocaleString()}</span>
                            
                            {[
                              "accepted",
                              "preparing",
                              "ready_for_pickup",
                              "picked_up",
                              "in_transit",
                              "out_for_delivery",
                            ].includes(sellerOrder.status?.toLowerCase()) && (
                              <button
                                onClick={() => navigate(`/buyer/order-tracking/${sellerOrder._id}`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                Live Tracking
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* DISPATCH FINANCIAL FOOTER LEDGER */}
                <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subtotal Valuations</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">Rs {order.totalProductAmount?.toLocaleString()}</h3>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consolidated Shipping</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">Rs {order.totalDeliveryCost?.toLocaleString()}</h3>
                  </div>
                  <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200">
                    <div>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Aggregate Invoice Pay</p>
                      <h2 className="text-3xl font-black text-slate-950 tracking-tight mt-0.5">Rs {order.totalAmount?.toLocaleString()}</h2>
                    </div>
                    {order.paymentStatus === "pending" && order.paymentMethod === "online" && (
                      <button
                        onClick={() => navigate(`/payment/initiate/${order._id}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors self-center sm:self-auto"
                      >
                        <CreditCard size={14} /> Pay Balance
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GetAllOrders;