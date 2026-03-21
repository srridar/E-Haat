import React, { useState, useEffect } from "react";
import {toast} from 'react-toastify';
import { MapPin,  Package,  Calendar,  ArrowRight,  ArrowLeft,  X,  Truck,  Ban} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";

const HireTransporter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState([]);

    const handleStatusChange = async (action) => {
        try {
            const res = await axios.put(`${TRANSPORTER_API_END_POINT}/request/${id}/status`,{ action },{ withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const getAllTransRequests = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${TRANSPORTER_API_END_POINT}/get-transport-req/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setRequest(res.data.request || []);
                    console.log(request);
                }
            } catch (err) {
                console.error("Error fetching requests:", err);
            }
            finally {
                setLoading(false);
            }
        };
        getAllTransRequests();
    }, []);


    if (loading) return <div className="text-center py-20 text-lg font-semibold italic text-blue-600">Loading Request details...</div>;

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative">
            <div className="absolute top-4 left-4 z-10">
                <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-orange-100 transition-colors text-orange-600">
                    <ArrowLeft size={20} />
                </button>
            </div>
            <div className="md:w-2/6 bg-slate-900 p-8 text-white">
                <div className="mt-8 mb-8">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Hiring Session</span>
                    <h2 className="text-3xl font-bold mt-2 mb-2">
                        <span className="text-orange-500 italic"> Do you want to be Hired ? </span> {request?.transporter?.name}
                    </h2>
                    <p className="text-gray-400 text-sm">Review the Order request befor accepting .</p>
                </div>

                <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                        <div className="bg-slate-800 p-3 rounded-lg"><MapPin className="text-blue-400 w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Your Base Rate</p>
                            <p className="text-lg font-mono text-blue-100">NRP {request?.transporter?.pricePerKm || "0"}/km</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-slate-800 p-3 rounded-lg"><Package className="text-orange-400 w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Your Vehicle Capacity</p>
                            <p className="text-lg font-mono text-orange-100">{request?.transporter?.vehicle?.capacityKg || "0"} Kg</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-3 italic underline">Trust & Safety</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Payments are held in secure escrow. Funds are only released to the transporter after you confirm successful delivery.
                    </p>
                </div>
            </div>


            <div className="md:w-2/3 p-4 md:p-12 bg-gray-50/50">
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Pickup Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                                <input name="pickupLocation.province" value={request?.pickupLocation?.province} placeholder="e.g. Lumbini" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                                <input name="pickupLocation.district" value={request?.pickupLocation?.district} placeholder="e.g. Rupandehi" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                                <input name="pickupLocation.municipality" value={request?.pickupLocation.municipality} placeholder="e.g. Butwal" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                                <input name="pickupLocation.ward" value={request?.pickupLocation.ward} placeholder="e.g. 11" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                            <div className="lg:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                                <input name="pickupLocation.landmark" value={request?.pickupLocation.landmark} placeholder="e.g. Near Kalika School" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Destination Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                                <input name="destinationLocation.province" value={request?.destinationLocation?.province} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                                <input name="destinationLocation.district" value={request?.destinationLocation?.district} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                                <input name="destinationLocation.municipality" value={request?.destinationLocation?.municipality} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                                <input name="destinationLocation.ward" value={request?.destinationLocation?.ward} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                            </div>
                            <div className="lg:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                                <input name="destinationLocation.landmark" value={request?.destinationLocation?.landmark} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Item Description</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    name="itemDescription"
                                    value={request?.itemDescription}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    placeholder="e.g. 50 Bags of Cement, Wooden Table..."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weightKg"
                                    value={request?.weightKg}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        value={request?.deliveryDate}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Your Offer (NRP)</label>
                                <input
                                    type="number"
                                    name="offeredPrice"
                                    value={request?.offeredPrice}
                                    className="w-full px-4 py-3 bg-white border  rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm border-blue-100 font-bold text-blue-700"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Estimated Distance(KM)</label>
                                <input
                                    type="number"
                                    name="estimatedDistanceKm"
                                    value={request?.estimatedDistanceKm}
                                    className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm border-blue-100 font-bold text-blue-700"
                                    placeholder="0.00"

                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4">

                        {(request.status === "pending" || request.status === "countered") && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("accept")}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    Accept
                                    <ArrowRight size={18} />
                                </button>

                                <button
                                    onClick={() => handleStatusChange("reject")}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                                >
                                    Reject
                                    <X size={18} />
                                </button>
                            </>
                        )}

                        {request.status === "accepted" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("start")}
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                                >
                                    Start Delivery
                                    <Truck size={18} />
                                </button>

                                <button
                                    onClick={() => handleStatusChange("cancel")}
                                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                >
                                    Cancel
                                    <Ban size={18} />
                                </button>
                            </>
                        )}

                        {request.status === "in_transit" && (
                            <button
                                onClick={() => handleStatusChange("deliver")}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                Mark as Delivered
                                <CheckCircle size={18} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HireTransporter;