import React, { useState, useEffect } from "react";
import {
    MapPin,
    Package,
    Calendar,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Truck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT, PRODUCT_API_END_POINT } from "@/utils/constants";
import LocationPicker from '@/components/LocationPicker';

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
            landmark: "",
            latitude: 27.7172,
            longitude: 85.3240
        },
        destinationLocation: {
            province: "",
            district: "",
            municipality: "",
            ward: "",
            landmark: "",
            latitude: 27.7172,
            longitude: 85.3240
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
        if (id) fetchTransporter();
    }, [id]);

    const handleLocationSelect = (coords, type) => {
        const [lat, lng] = coords;
        setFormData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                latitude: lat,
                longitude: lng
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${PRODUCT_API_END_POINT}/hiretransporter`, formData, { withCredentials: true });
            if (res.data.success) setSubmitted(true);
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex flex-col items-center justify-center min-h-screen space-y-4 font-semibold text-blue-600 animate-pulse"><Truck className="w-12 h-12 animate-bounce" /> Loading details...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-xl m-10 border border-red-200">{error}</div>;

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto my-20 p-12 bg-white rounded-[2.5rem] shadow-2xl text-center border border-green-100 transform transition-all scale-100">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="text-green-600 w-14 h-14" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">Request Dispatched!</h2>
                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                    Great news! Your request has been sent to <span className="font-bold text-gray-800">{transporter?.name}</span>. 
                    Track your status in the dashboard.
                </p>
                <button onClick={() => navigate("/buyer/profile")} className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                    Back to My Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto my-8 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[800px]">

            <div className="lg:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between">
                <div>
                    <button onClick={() => navigate(-1)} className="mb-10 bg-slate-800 p-3 rounded-2xl hover:bg-orange-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">Booking Portal</span>
                    <h2 className="text-4xl font-bold mt-3 mb-6 leading-tight">
                        Hire <span className="text-orange-500">{transporter?.name}</span>
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex items-center gap-5">
                            <div className="bg-blue-500/20 p-3 rounded-xl"><MapPin className="text-blue-400 w-6 h-6" /></div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black">Base Rate</p>
                                <p className="text-xl font-mono">Rs. {transporter?.pricePerKm}/km</p>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex items-center gap-5">
                            <div className="bg-orange-500/20 p-3 rounded-xl"><Package className="text-orange-400 w-6 h-6" /></div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black">Vehicle Limit</p>
                                <p className="text-xl font-mono">{transporter?.vehicle?.capacityKg} Kg</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20">
                    <h4 className="text-sm font-bold text-blue-400 mb-2 italic">Secure Logistics</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Your payment is secured via Escrow. The transporter only receives funds once you confirm the item has arrived safely.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-2/3 p-6 md:p-12 bg-gray-50/50 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* Pickup Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-800 rounded-2xl flex items-center justify-center text-white font-bold">1</div>
                            <h3 className="text-xl font-bold text-gray-800">Pickup Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            {['province', 'district', 'municipality', 'ward', 'landmark'].map((field) => (
                                <div key={field} className={field === 'landmark' ? "md:col-span-2" : ""}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{field}</label>
                                    <input 
                                        name={`pickupLocation.${field}`} 
                                        value={formData.pickupLocation[field]} 
                                        onChange={handleChange} 
                                        className="w-full mt-1 p-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                        placeholder={`Enter ${field}...`}
                                        required={field !== 'ward' && field !== 'landmark'}
                                    />
                                </div>
                            ))}
                            <div className="md:col-span-2 h-[300px] rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 mt-2">
                                <LocationPicker
                                    onSelect={(coords) => handleLocationSelect(coords, 'pickupLocation')}
                                    currentCoords={[formData.pickupLocation.latitude, formData.pickupLocation.longitude]}
                                    isEditable={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destination Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold">2</div>
                            <h3 className="text-xl font-bold text-gray-800">Destination Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            {['province', 'district', 'municipality', 'ward', 'landmark'].map((field) => (
                                <div key={field} className={field === 'landmark' ? "md:col-span-2" : ""}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{field}</label>
                                    <input 
                                        name={`destinationLocation.${field}`} 
                                        value={formData.destinationLocation[field]} 
                                        onChange={handleChange} 
                                        className="w-full mt-1 p-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
                                        placeholder={`Enter ${field}...`}
                                        required={field !== 'ward' && field !== 'landmark'}
                                    />
                                </div>
                            ))}
                            <div className="md:col-span-2 h-[300px] rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 mt-2">
                                <LocationPicker
                                    onSelect={(coords) => handleLocationSelect(coords, 'destinationLocation')}
                                    currentCoords={[formData.destinationLocation.latitude, formData.destinationLocation.longitude]}
                                    isEditable={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Item & Price Section */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Item Description</label>
                                <input
                                    required
                                    name="itemDescription"
                                    value={formData.itemDescription}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="What are we transporting?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weightKg"
                                    value={formData.weightKg}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Pickup Date</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-orange-400">Offered Price (NRP)</label>
                                <input
                                    type="number"
                                    name="offeredPrice"
                                    value={formData.offeredPrice}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-800 border-2 border-orange-500/30 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-orange-400"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Distance (KM)</label>
                                <input
                                    type="number"
                                    name="estimatedDistanceKm"
                                    value={formData.estimatedDistanceKm}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                            {loading ? "Sending..." : "Confirm & Send Request"}
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HireTransporter;