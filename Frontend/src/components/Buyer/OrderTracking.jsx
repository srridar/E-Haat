import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  CalendarDays,
  CreditCard,
  User,
  ShoppingBag,
  Hash,
  Sparkles,
  RefreshCw
} from "lucide-react";

import { BUYER_API_END_POINT } from "@/utils/constants";

const OrderTracking = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { orderId } = useParams();

  // seller order statuses
  const steps = [
    "pending",
    "accepted",
    "preparing",
    "ready_for_pickup",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
  ];

  const getStepIndex = (status) => {
    return steps.indexOf(status?.toLowerCase());
  };

  useEffect(() => {
    const fetchCurrentOrder = async () => {
      try {
        const res = await axios.get(
          `${BUYER_API_END_POINT}/track-order/${orderId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (error) {
        console.error("Order fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentOrder();
  }, [orderId]);

  // Premium Pulse Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-ping" />
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
            <RefreshCw className="text-indigo-600 animate-spin" size={28} />
          </div>
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Syncing Live Ledger...</h3>
        <p className="text-xs text-slate-400 mt-1">Fetching absolute fulfillment metrics from backend pipeline.</p>
      </div>
    );
  }

  // Polished Empty/Error State
  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-50/30">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <Package size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Manifest Missing</h1>
        <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">
          The requested tracking token does not correlate with an active marketplace shipment record.
        </p>
        <button
          onClick={() => navigate("/buyer/all-orders")}
          className="mt-6 text-sm font-bold bg-slate-950 text-white px-5 py-2.5 rounded-xl transition-colors hover:bg-slate-800"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-slate-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* SUCCESS CELEBRATION HEADER */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-emerald-500/20 pointer-events-none">
            <Sparkles size={120} className="animate-pulse" />
          </div>
          
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-emerald-50 border border-emerald-200/60 shadow-xs mb-4">
            <CheckCircle2 size={38} className="text-emerald-600" />
          </div>

          <span className="block text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">Procurement Authorized</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Order Successfully Placed
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base flex items-center justify-center gap-1.5 font-medium">
            <Hash size={14} className="text-slate-400" /> Seller Order Hash Token:
            <span className="text-indigo-600 font-extrabold tracking-mono">
              #{order._id?.slice(-12).toUpperCase()}
            </span>
          </p>
        </div>

        {/* COMPREHENSIVE TRACKING WRAPPER CARD */}
        <div className="bg-white rounded-[2rem] border border-slate-200/70 shadow-xl shadow-slate-100/40 overflow-hidden mb-10">
          
          {/* MODERN MASTHEAD SUMMARY BANNER */}
          <div className="bg-slate-950 px-6 sm:px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-indigo-950/40 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Current Fulfillment Milestone</span>
                <h2 className="text-2xl sm:text-3xl font-black capitalize tracking-tight mt-1 text-white">
                  {order.status?.replaceAll("_", " ")}
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 min-w-[120px]">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Settlement Route</p>
                  <h3 className="font-extrabold text-sm uppercase text-slate-200 mt-0.5">
                    {order?.mainOrder?.paymentMethod || "COD"}
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 min-w-[140px]">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Capital Pay</p>
                  <h3 className="font-black text-sm text-emerald-400 mt-0.5">
                    Rs {order.totalAmount?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC PROGRESSIVE TIMELINE TRACKER */}
          <div className="p-6 sm:p-8 border-b border-slate-100 overflow-x-auto bg-slate-50/30">
            <div className="min-w-[850px] relative flex justify-between items-start py-4">
              
              {/* Timeline Track Bars */}
              <div className="absolute top-[38px] left-0 w-full h-[3px] bg-slate-200/70 rounded-full" />
              <div
                className="absolute top-[38px] left-0 h-[3px] bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${
                    currentStep <= 0 ? 0 : (currentStep / (steps.length - 1)) * 100
                  }%`,
                }}
              />

              {steps.map((step, idx) => (
                <div key={step} className="relative z-10 flex flex-col items-center w-24 text-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
                      idx <= currentStep
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {idx < currentStep ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <span className="font-black text-xs">{idx + 1}</span>
                    )}
                  </div>

                  <p
                    className={`mt-3 text-[10px] font-bold uppercase tracking-wide leading-tight px-1 ${
                      idx <= currentStep ? "text-emerald-700 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    {step.replaceAll("_", " ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TWO COLUMN LOGISTICS DETAILS METRIC */}
          <div className="grid lg:grid-cols-12 gap-0">
            
            {/* LEFT COMPARTMENT: ROUTING & ENTITIES */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100">
              
              {/* Merchant Details Block */}
              <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <User className="text-indigo-600" size={18} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Supplier Profile
                  </h3>
                </div>
                <div className="pl-7 space-y-0.5">
                  <p className="font-bold text-base text-slate-800">{order?.seller?.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{order?.seller?.email}</p>
                </div>
              </div>

              {/* Geo-Tracking Shipping Endpoint */}
              <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <MapPin className="text-emerald-600" size={18} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Consignment Destination Target
                  </h3>
                </div>
                <div className="pl-7 space-y-1 text-slate-700 text-xs font-medium">
                  <p className="font-bold text-sm text-slate-900">{order?.deliveryLocation?.municipality}</p>
                  <p className="text-slate-500">
                    {order?.deliveryLocation?.district}, {order?.deliveryLocation?.province}
                  </p>
                  <div className="flex gap-4 pt-1 text-slate-400 font-semibold">
                    <span>Ward: <strong className="text-slate-700">{order?.deliveryLocation?.ward}</strong></span>
                    <span>Landmark: <strong className="text-slate-700">{order?.deliveryLocation?.landmark || "N/A"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Delivery Update Accent Card */}
              <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <Truck className="text-indigo-600 animate-pulse" size={18} />
                  <h3 className="font-bold text-indigo-900 uppercase tracking-wider text-xs">
                    Logistics Channel Node
                  </h3>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  Your pipeline parcel status is verified as <strong className="text-indigo-700 capitalize">{order.status?.replaceAll("_", " ")}</strong>. Status sync updates map automatically.
                </p>
              </div>
            </div>

            {/* RIGHT COMPARTMENT: ITEMIZED COMMODITIES SUMMARY */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/20">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <ShoppingBag className="text-slate-800" size={18} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Itemized Commodities
                  </h3>
                </div>

                {/* Line Item Generation */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {order.products?.map((item) => (
                    <div key={item._id} className="bg-white border border-slate-200/60 rounded-xl p-3.5 shadow-2xs group hover:border-slate-300 transition-colors">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                            <Package size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{item?.product?.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-medium">
                              <span>Units: <strong className="text-slate-600">{item.quantity}</strong></span>
                              <span>•</span>
                              <span>Rate: <strong className="text-slate-600">Rs {item.price?.toLocaleString()}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subtotal</p>
                          <p className="font-extrabold text-xs sm:text-sm text-slate-900 mt-0.5">
                            Rs {item.subtotal?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Balance Ledger */}
              <div className="border-t border-slate-200/80 mt-6 pt-5 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-medium text-slate-500 px-1">
                  <span>Logistics Transport Fee</span>
                  <span className="text-slate-900 font-bold">Rs {order.deliveryCost?.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-xl p-4 mt-2 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Total Invoice Valuation</span>
                    <p className="text-xs text-slate-400 mt-0.5">All tax structures included</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Rs {order.totalAmount?.toLocaleString()}
                  </span>
                </div>

                {/* Micro Metadata Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="bg-white border border-slate-100 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                      <CalendarDays size={10} /> Authorized On
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                      <CreditCard size={10} /> Escrow Status
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-1 capitalize">
                      {order?.mainOrder?.paymentStatus || "Pending"}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* CORE INTERFACE NAVIGATION DISPATCHERS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate("/product/all")}
            className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/buyer/all-orders")}
            className="w-full sm:w-auto min-w-[200px] px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 group"
          >
            All Orders Hub
            <ArrowRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;