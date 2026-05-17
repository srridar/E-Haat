import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Package,
  CreditCard,
  CalendarDays,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Wallet,
  User,
  Layers3,
  ShoppingBag,
  ArrowLeft,
  Mail
} from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const MainOrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${BUYER_API_END_POINT}/track-main-order/${orderId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (error) {
        console.error("Error fetching order parameters upstream:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusBadge = (status) => {
    const baseline = "px-3.5 py-1.5 rounded-xl border text-xs font-bold tracking-wide inline-flex items-center gap-1.5 capitalize transition-all";
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return (
          <span className={`${baseline} bg-emerald-50 text-emerald-700 border-emerald-200/80`}>
            <CheckCircle2 size={13} /> {status.replaceAll("_", " ")}
          </span>
        );
      case "pending":
      case "processing":
        return (
          <span className={`${baseline} bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse`}>
            <Clock3 size={13} /> {status.replaceAll("_", " ")}
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseline} bg-rose-50 text-rose-700 border-rose-200/80`}>
            <AlertCircle size={13} /> {status.replaceAll("_", " ")}
          </span>
        );
      default:
        return (
          <span className={`${baseline} bg-indigo-50 text-indigo-700 border-indigo-200/80`}>
            <Truck size={13} /> {status?.replaceAll("_", " ") || "Unknown State"}
          </span>
        );
    }
  };

  const deliveredOrders = order?.sellerOrders?.filter(o => o.status === "delivered").length || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <ShoppingBag size={16} className="absolute text-indigo-600 animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
            <Package size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Record Isolated</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The requested token endpoint failed validation parameter matching. It may have been archived or purged from upstream storage routes.
          </p>
          <button
            onClick={() => navigate("/buyer/all-orders")}
            className="mt-6 w-full px-4 py-3 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
          >
            Return to Pipeline Index
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* INTERACTIVE NAVIGATION LINK ACTION */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/buyer/all-orders")}
            className="group p-2 bg-white hover:bg-slate-950 border border-slate-200 rounded-xl transition-all shadow-sm text-slate-500 hover:text-white"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-extrabold block">Procurement Management</span>
            <h2 className="text-xs text-slate-400 font-medium">Trace dynamic fulfillment matrices from sub-merchant pools</h2>
          </div>
        </div>

        {/* METRIC GLASSMORPHIC HERO BOARD BANNER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="bg-slate-950 p-6 sm:p-8 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 relative z-10">
              <div>
                <span className="inline-block uppercase text-[10px] tracking-widest bg-white/10 border border-white/10 text-indigo-300 font-extrabold px-2.5 py-1 rounded-md">
                  Consolidated Main Manifest
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3">
                  #{order._id.slice(-12).toUpperCase()}
                </h1>
                <div className="flex items-center gap-2 mt-2.5 text-slate-400 text-xs font-medium">
                  <CalendarDays size={14} className="text-slate-500" />
                  System Registered: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* FLOATING CONTEXT METRIC MATRIX PANELS */}
              <div className="flex flex-wrap gap-3.5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[150px] backdrop-blur-sm">
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <Wallet size={12} className="text-indigo-400" /> Settlement
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold tracking-wide uppercase text-slate-100">{order.paymentMethod}</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[150px] backdrop-blur-sm">
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <CreditCard size={12} className="text-indigo-400" /> Payment State
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold tracking-wide capitalize text-slate-100">{order.paymentStatus}</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[150px] backdrop-blur-sm">
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <Truck size={12} className="text-indigo-400" /> Operational State
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold tracking-wide capitalize text-slate-100">
                    {order.overallStatus?.replaceAll("_", " ")}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER HIGHLIGHT METRICS ROW STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 bg-slate-50/50 border-t border-slate-100 text-slate-800">
            <div className="p-5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sub-Orders Allocated</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">{order.sellerOrders?.length || 0} Nodes</h2>
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Successful Drops</p>
              <h2 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{deliveredOrders} Consigned</h2>
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Integrated Delivery Fees</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">Rs {order.totalDeliveryCost?.toLocaleString()}</h2>
            </div>
            <div className="p-5 bg-indigo-50/20">
              <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Grand Aggregate Gross</p>
              <h2 className="mt-1 text-2xl font-black text-indigo-600 tracking-tight">Rs {order.totalAmount?.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* SELLER CONSIGNMENTS MAP CONTAINER BLOCK */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Layers3 className="text-slate-800" size={16} />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Consolidated Merchant Fulfillment Nodes</h2>
          </div>

          <div className="space-y-5">
            {order.sellerOrders?.map((sellerOrder) => (
              <div
                key={sellerOrder._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* LEFT: MERCHANT ENTITY PROFILES & LINE MANIFEST ITEMS */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600">
                          <User size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            {sellerOrder?.seller?.name || "Independent Merchant"}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <Mail size={11} className="text-slate-300" /> {sellerOrder?.seller?.email || "No contact routing provided"}
                          </p>
                        </div>
                      </div>
                      <div>{getStatusBadge(sellerOrder.status)}</div>
                    </div>

                    {/* ITEM ENTITY ITERATION NODES */}
                    <div className="space-y-2.5">
                      {sellerOrder.products?.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center bg-slate-50/50 border border-slate-100 hover:bg-slate-50/80 rounded-xl p-3 transition-colors group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 group-hover:scale-102 transition-transform duration-200">
                              <img
                                src={item?.product?.images?.[0]?.url || "/placeholder-item.png"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-xs truncate max-w-[200px] sm:max-w-md">
                                {item?.product?.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                Unit Allotment Quantity: <span className="text-slate-700 font-bold">{item.quantity}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Subtotal</p>
                            <h4 className="font-bold text-slate-900 text-xs mt-0.5">
                              Rs {item.subtotal?.toLocaleString()}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: VENDOR PARCEL COMPACT LEDGER RECAP */}
                  <div className="lg:w-[260px] flex flex-col justify-between bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 sm:p-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                        <ShoppingBag size={14} className="text-indigo-600" />
                        <h4 className="font-bold text-slate-800 text-xs tracking-tight">Consignment Financials</h4>
                      </div>

                      <div className="space-y-2.5 text-xs font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Items Count</span>
                          <span className="font-bold text-slate-800">{sellerOrder.products?.length || 0} Variant(s)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Logistics Routing</span>
                          <span className="font-bold text-slate-800">Rs {sellerOrder.deliveryCost?.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-baseline">
                          <span className="text-slate-700 font-bold">Node Gross</span>
                          <span className="font-black text-indigo-600 text-sm">
                            Rs {sellerOrder.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/buyer/order-tracking/${sellerOrder._id}`)}
                      className="mt-5 w-full bg-slate-950 hover:bg-indigo-600 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
                    >
                      <span>Track Consignment</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainOrderTracking;