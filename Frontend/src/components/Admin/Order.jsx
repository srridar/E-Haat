import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, MapPin, Package, CheckCircle2, Info,
    XCircle, Truck, PackageCheck, Receipt, ShieldCheck, 
    Navigation, ChevronRight
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
            if (res.data.success) setOrder(res.data.order);
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
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#121212]">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-indigo-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Retrieving Manifest...</p>
        </div>
    );

    if (!order) return <div className="p-20 text-center font-bold text-gray-500 bg-[#121212] min-h-screen">Order Not Found</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-gray-100 pb-20">
            {/* Header / Actions */}
            <div className="bg-[#1e1e1e]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 px-6 py-4 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate(-1)} className="p-2.5 bg-[#121212] border border-gray-800 hover:border-indigo-500 rounded-xl transition-all group">
                            <ArrowLeft size={18} className="text-gray-400 group-hover:text-indigo-400" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-black text-white tracking-tighter">ORDER <span className="text-indigo-500">#{order._id.slice(-6).toUpperCase()}</span></h1>
                                <StatusBadge status={order.status} />
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">Origin: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={updating}
                            onClick={() => navigate(`/order-tracking/${id}`)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#121212] border border-gray-800 text-white text-xs font-black rounded-xl hover:border-indigo-500 transition-all uppercase tracking-widest"
                        >
                            <Navigation size={16} className="text-indigo-400" /> Live Intel
                        </button>

                        <div className="h-8 w-[1px] bg-gray-800 mx-2 hidden md:block"></div>

                        {order.status === "pending" && (
                            <>
                                <button disabled={updating} onClick={() => handleUpdateStatus(id, "accepted")} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest">Accept</button>
                                <button disabled={updating} onClick={() => handleUpdateStatus(id, "rejected")} className="px-6 py-2.5 bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">Reject</button>
                            </>
                        )}
                        {order.status === "accepted" && (
                            <button disabled={updating} onClick={() => handleUpdateStatus(id, "picked")} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest">Mark as Picked</button>
                        )}
                        {order.status === "picked" && (
                            <button disabled={updating} onClick={() => handleUpdateStatus(id, "delivered")} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest">Complete Drop-off</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Main Logistics */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Progress Tracker */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 p-10 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Truck size={120} />
                            </div>
                            <OrderProgress currentStatus={order.status} />
                        </div>

                        {/* Contents */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 shadow-xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-[#252525]/30">
                                <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Package size={18} className="text-indigo-400" /> Manifest Content
                                </h3>
                                <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg">
                                    {order.products.length} UNITS
                                </span>
                            </div>
                            <div className="p-4 space-y-2">
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-[#121212]/50 border border-transparent hover:border-gray-800 rounded-2xl transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-[#1e1e1e] border border-gray-800 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-indigo-400 transition-colors">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white tracking-tight">{item.product?.name || "Unknown SKU"}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest flex items-center gap-2">
                                                    Merchant: <span className="text-gray-300">{item.seller?.name || "External"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-mono font-bold text-indigo-400">Rs. {item.product?.price?.toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LocationCard title="Logistics Hub (Pickup)" data={order.deliveryLocation.pickupLocation} variant="indigo" />
                            <LocationCard title="End Point (Destination)" data={order.deliveryLocation.destinationLocation} variant="emerald" />
                        </div>
                    </div>

                    {/* Right: Intelligence & Financials */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Financial Ledger */}
                        <div className="bg-gradient-to-br from-[#1e1e1e] to-[#121212] rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-[80px]"></div>
                            <h3 className="font-black text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Receipt size={14} /> Ledger Summary
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Net Value</span>
                                    <span className="font-mono text-gray-200">Rs. {order.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Logistics Overhead</span>
                                    <span className="font-mono text-gray-200">Rs. {order.deliveryCost?.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-800/50 my-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Authorized Amount</span>
                                    <span className="text-3xl font-black tracking-tighter text-white">Rs. {order.totalCost?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Integrity Metrics */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-indigo-500" /> Security Protocol
                            </h3>
                            <div className="space-y-4">
                                <RatingRow label="Seller Auth" status={order.isSellerRated} />
                                <RatingRow label="Content QC" status={order.isProductRated} />
                                <RatingRow label="Agent Fidelity" status={order.isTransporterRated} />
                            </div>
                        </div>

                        {/* Audit Log Note */}
                        <div className="p-6 bg-indigo-500/5 rounded-[1.5rem] border border-indigo-500/10">
                            <div className="flex gap-3">
                                <Info size={16} className="text-indigo-400 shrink-0" />
                                <p className="text-[10px] text-indigo-300/70 font-medium leading-relaxed italic">
                                    SYSTEM NOTICE: Any modifications to this manifest are final and logged against your administrative credentials.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        picked: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest ${styles[status] || 'bg-gray-800'}`}>
            {status}
        </span>
    );
};

const OrderProgress = ({ currentStatus }) => {
    const steps = ["pending", "accepted", "picked", "delivered"];
    const currentIndex = steps.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto py-2">
            {steps.map((step, idx) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-700 ${idx <= currentIndex 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                            : 'bg-[#121212] border-gray-800 text-gray-600'
                        }`}>
                            {idx < currentIndex ? <CheckCircle2 size={20} /> : <span className="text-xs font-black font-mono">{idx + 1}</span>}
                        </div>
                        <p className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${idx <= currentIndex ? 'text-indigo-400' : 'text-gray-600'}`}>{step}</p>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className="flex-1 h-[2px] mx-2 bg-gray-800 relative">
                            <div 
                                className="absolute inset-0 bg-indigo-500 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                style={{ width: idx < currentIndex ? '100%' : '0%' }}
                            ></div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const LocationCard = ({ title, data, variant }) => (
    <div className="bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-800 shadow-xl group hover:border-gray-700 transition-all">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 ${variant === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'}`}>
            <MapPin size={14} /> {title}
        </p>
        <div className="space-y-3">
            <p className="text-lg font-bold text-white tracking-tight leading-tight">{data?.landmark}</p>
            <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                    {data?.municipality} <ChevronRight size={12} className="text-gray-700" /> Ward {data?.ward}
                </p>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                    {data?.district}, {data?.province}
                </p>
            </div>
        </div>
    </div>
);

const RatingRow = ({ label, status }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212]/50 border border-transparent hover:border-gray-800 transition-all">
        <span className={`text-[11px] font-bold tracking-tight ${status ? 'text-gray-200' : 'text-gray-600'}`}>{label}</span>
        <div className={`p-1 rounded-lg ${status ? 'text-emerald-400' : 'text-gray-800'}`}>
            <CheckCircle2 size={16} fill={status ? "currentColor" : "none"} fillOpacity={0.1} />
        </div>
    </div>
);

export default OrderDetail;