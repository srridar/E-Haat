import React, { useState, useEffect } from "react";
import {
    MapPin,
    Package,
    Calendar,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { PRODUCT_API_END_POINT } from "@/utils/constants";

const HireTransporter = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transporter, setTransporter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        transporter: id,
        pickupLocation: {
            province: "",
            district: "",
            municipality: "",
            ward: "",
            landmark: ""
        },
        destinationLocation: {
            province: "",
            district: "",
            municipality: "",
            ward: "",
            landmark: ""
        },
        itemDescription: "",
        weightKg: "",
        deliveryDate: "",
        offeredPrice: "",
        estimatedDistanceKm: "",
    });

    useEffect(() => {
        const fetchTransporter = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${ADMIN_API_END_POINT}/gettransporter/${id}`);

                if (response.data?.success) {
                    setTransporter(response.data.transporter);
                } else {
                    setError("Transporter not found");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch transporter details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTransporter();
        }
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value }, }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value, }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${PRODUCT_API_END_POINT}/hiretransporter`, formData, { withCredentials: true });
            if (res.data.success) {
                setSubmitted(true);
            }

        } catch (err) {
            alert("Error submitting request: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-lg font-semibold italic text-blue-600">Loading transporter details...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;
    if (!transporter) return <div className="text-center py-20 font-semibold text-gray-500">No transporter found.</div>;

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto my-10 p-10 bg-white rounded-3xl shadow-xl text-center border border-green-100 animate-in fade-in zoom-in duration-300">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Sent!</h2>
                <p className="text-gray-600 mb-8">
                    Your hiring request has been sent to <strong>{transporter?.name}</strong>.
                    You will be notified once they accept the terms.
                </p>
                <button onClick={() => navigate("/buyer/profile")}  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative">
            <div className="absolute top-4 left-4 z-10">
                <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-orange-100 transition-colors text-orange-600">
                    <ArrowLeft size={20} />
                </button>
            </div>
            <div className="md:w-1/3 bg-slate-900 p-8 text-white">
                <div className="mt-8 mb-8">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Hiring Session</span>
                    <h2 className="text-3xl font-bold mt-2 mb-2">
                        <span className="text-orange-500 italic">Hire</span> {transporter?.name}
                    </h2>
                    <p className="text-gray-400 text-sm">Review the transporter's capacity and rates before sending your offer.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                        <div className="bg-slate-800 p-3 rounded-lg"><MapPin className="text-blue-400 w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Base Rate</p>
                            <p className="text-lg font-mono text-blue-100">NRP {transporter?.pricePerKm || "0"}/km</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-slate-800 p-3 rounded-lg"><Package className="text-orange-400 w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Max Capacity</p>
                            <p className="text-lg font-mono text-orange-100">{transporter?.vehicle?.capacityKg || "0"} Kg</p>
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


            <div className="md:w-2/3 p-8 md:p-12 bg-gray-50/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Pickup Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                                <input name="pickupLocation.province" value={formData.pickupLocation.province} onChange={handleChange} placeholder="e.g. Lumbini" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                                <input name="pickupLocation.district" value={formData.pickupLocation.district} onChange={handleChange} placeholder="e.g. Rupandehi" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                                <input name="pickupLocation.municipality" value={formData.pickupLocation.municipality} onChange={handleChange} placeholder="e.g. Butwal" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                                <input name="pickupLocation.ward" value={formData.pickupLocation.ward} onChange={handleChange} placeholder="e.g. 11" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                            <div className="lg:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                                <input name="pickupLocation.landmark" value={formData.pickupLocation.landmark} onChange={handleChange} placeholder="e.g. Near Kalika School" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
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
                                <input name="destinationLocation.province" value={formData?.destinationLocation?.province} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                                <input name="destinationLocation.district" value={formData?.destinationLocation?.district} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                                <input name="destinationLocation.municipality" value={formData.destinationLocation?.municipality} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                                <input name="destinationLocation.ward" value={formData?.destinationLocation?.ward} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                            </div>
                            <div className="lg:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                                <input name="destinationLocation.landmark" value={formData?.destinationLocation?.landmark} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Item Description</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    name="itemDescription"
                                    value={formData.itemDescription}
                                    onChange={handleChange}
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
                                    value={formData.weightKg}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        value={formData.deliveryDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Your Offer (NRP)</label>
                                <input
                                    type="number"
                                    name="offeredPrice"
                                    value={formData.offeredPrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-bold text-blue-700"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Estimated Distance(KM)</label>
                                <input
                                    type="number"
                                    name="estimatedDistanceKm"
                                    value={formData.estimatedDistanceKm}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-bold text-blue-700"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group">
                            Send Hiring Request
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-4 leading-tight italic">
                            By clicking, you agree to the transporter's terms. The transporter may accept your offer or propose a counter-offer.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HireTransporter;