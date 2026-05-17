import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    CheckCircle,
    Package,
    ShoppingBag,
    CreditCard,
    Truck,
    Hash,
    ChevronRight,
    ArrowLeft,
    Store,
    Loader2
} from "lucide-react";
import { ORDER_API_END_POINT} from "@/utils/constants";

const OrderSuccessPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(
                    `${ORDER_API_END_POINT}/order/${orderId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setOrder(res.data.order);
                }
            } catch (err) {
                console.error("Failed to query current order manifest:", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
                <Loader2 className="text-indigo-600 animate-spin mb-4" size={32} />
                <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Verifying Transaction...</h3>
                <p className="text-xs text-slate-400 mt-1">Securing handshake signals from core bank gateway.</p>
            </div>
        );
    }

  
    if (!order) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-slate-50/30">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
                    <Package size={24} />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Order Record Unresolved</h1>
                <p className="text-slate-500 text-xs mt-1 text-center max-w-xs">
                    The order clearance token could not be localized. It may still be syncing to our ledger database.
                </p>
                <button
                    onClick={() => navigate("/buyer/all-orders")}
                    className="mt-6 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                    View Order Manifest
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/40 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* CELEBRATION MASTHEAD ROW */}
                <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                        <CheckCircle size={32} />
                    </div>

                    <div className="text-center sm:text-left space-y-1 flex-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Checkout Complete</span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Order Placed Successfully</h1>
                        <p className="text-xs sm:text-sm text-slate-500">Thank you for your procurement. Your distribution routes are now active.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 self-stretch sm:self-auto flex sm:flex-col items-center justify-between sm:justify-center text-center gap-1 min-w-[150px]">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1"><Hash size={10} /> Order ID Stamp</span>
                        <span className="text-xs font-extrabold text-indigo-600 tracking-mono">#{order._id?.slice(-12).toUpperCase()}</span>
                    </div>
                </div>

   
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><ShoppingBag size={18} /></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Invoice</p>
                            <h4 className="font-black text-base text-slate-900 mt-0.5">Rs {order.totalAmount?.toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><CreditCard size={18} /></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Gateway</p>
                            <h4 className="font-extrabold text-xs uppercase tracking-wide text-slate-700 mt-1">{order.paymentMethod}</h4>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Truck size={18} /></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Global Pipeline</p>
                            <h4 className="font-bold text-xs text-indigo-600 bg-indigo-50/60 border border-indigo-100 px-2 py-0.5 rounded-md inline-block mt-0.5 capitalize">Active Tracking</h4>
                        </div>
                    </div>
                </div>


                <div className="bg-white border border-slate-200/70 p-6 sm:p-8 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Truck size={18} className="text-slate-800" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Fulfillment Roadmap</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                        <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 hidden sm:block z-0" />

                        {[
                            { title: "Order Logged", active: true, desc: "System verified payload" },
                            { title: "Merchant Prep", active: false, desc: "Awaiting split packaging" },
                            { title: "Transit Dispatched", active: false, desc: "Assigned hub priority courier" },
                            { title: "Final Dropoff", active: false, desc: "Delivery checkpoint settlement" }
                        ].map((step, index) => (
                            <div key={index} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-2 relative z-10">
                                <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xs shrink-0 font-bold text-xs ${step.active ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10" : "bg-slate-200 text-slate-400"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-wide ${step.active ? "text-emerald-700" : "text-slate-500"}`}>{step.title}</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

   
                <div className="bg-white border border-slate-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <Package size={18} className="text-slate-800" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Consignment Manifest Split</h2>
                    </div>

                    <div className="space-y-8">
                        {order.sellerOrders?.map((sellerOrder) => (
                            <div key={sellerOrder._id} className="border border-slate-100 rounded-2xl bg-slate-50/40 overflow-hidden">

                                {/* Vendor Header Row */}
                                <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <Store size={14} className="text-indigo-500" />
                                        <span>Vendor Asset Node: <strong className="text-slate-900 font-extrabold">{sellerOrder.seller?.name}</strong></span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                        Split ID: #{sellerOrder._id?.slice(-6).toUpperCase()}
                                    </span>
                                </div>

                                {/* Line Item Commodities */}
                                <div className="p-4 sm:p-5 space-y-3">
                                    {sellerOrder.products?.map((p, index) => (
                                        <div key={index} className="flex items-center justify-between gap-4 bg-white border border-slate-100 p-3.5 rounded-xl shadow-3xs group hover:border-slate-300/80 transition-colors">
                                            <div className="space-y-0.5">
                                                <h4 className="font-bold text-slate-800 text-sm">{p.product?.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                    <span>Quantity Metrics: <strong className="text-slate-600">{p.quantity}</strong></span>
                                                    <span>•</span>
                                                    <span>Unit Matrix: <strong className="text-slate-600">Rs {p.price?.toLocaleString()}</strong></span>
                                                </div>
                                            </div>
                                            <p className="font-black text-sm text-slate-900 shrink-0">
                                                Rs {p.subtotal?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Vendor Split Ledger Total */}
                                <div className="bg-white border-t border-slate-100 px-5 py-3 flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-medium">Split Consignment Valuation:</span>
                                    <span className="font-black text-slate-900">Rs {sellerOrder.totalAmount?.toLocaleString()}</span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

           
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 sm:p-6 rounded-[2.2rem] shadow-md text-white">
                    <button
                        onClick={() => navigate("/product/all")}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 hover:border-white/30 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft size={14} /> Continue Shopping
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate("/buyer/all-orders")}
                            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all text-center border border-white/5"
                        >
                            Order History
                        </button>
                        <button
                            onClick={() => navigate(`/buyer/main-order-tracking/${orderId}`)}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm flex items-center justify-center gap-1 transition-all group"
                        >
                            Live Tracking Dashboard <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccessPage;