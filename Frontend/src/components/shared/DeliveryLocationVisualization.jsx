import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BUYER_API_END_POINT } from "@/utils/constants";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { 
    Package, 
    Weight, 
    CircleDollarSign, 
    Truck, 
    MapPin, 
    ChevronLeft,
    Clock
} from "lucide-react";

// ✅ Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Routing = ({ pickup, drop }) => {
    const map = useMap();
    useEffect(() => {
        if (!pickup || !drop) return;
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup.latitude, pickup.longitude),
                L.latLng(drop.latitude, drop.longitude),
            ],
            lineOptions: {
                styles: [{ color: "#3b82f6", weight: 6, opacity: 0.8 }],
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [pickup, drop, map]);
    return null;
};

const DeliveryLocationVisualization = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderInformation = async () => {
        try {
            const res = await axios.get(`${BUYER_API_END_POINT}/get-transport-req/${id}`, { withCredentials: true });
            if (res.data.success) {
                setOrder(res.data.request);
            }
        } catch (error) {
            console.error("Order fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderInformation();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">Initializing Tracking System...</p>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full bg-slate-50 overflow-hidden font-sans">
            {/* 🔙 Back Button & Header */}
            <div className="absolute top-6 left-6 z-[1000] flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white shadow-xl rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
                >
                    <ChevronLeft className="text-slate-700" size={24} />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <span className="font-bold text-slate-800 tracking-tight">Live Tracking</span>
                </div>
            </div>

            {/* 📊 Floating Info Sidebar */}
            <div className="absolute top-6 right-6 z-[1000] w-96 flex flex-col gap-4">
                {/* Status Card */}
                <div className="bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-slate-700 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-black tracking-widest mb-1">Order Status</p>
                            <h2 className="text-2xl font-bold capitalize">{order?.status || "Processing"}</h2>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-2xl">
                            <Truck className="text-blue-400" size={28} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
                            <Package className="text-slate-400" size={18} />
                            <span className="text-sm font-medium">{order?.itemDescription}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-2">
                                <Weight className="text-slate-400" size={16} />
                                <span className="text-sm font-bold">{order?.weightKg} kg</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-2">
                                <CircleDollarSign className="text-slate-400" size={16} />
                                <span className="text-sm font-bold">Rs. {order?.offeredPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-slate-200">
                    <h4 className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-4">Route Details</h4>
                    <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {/* Pickup */}
                        <div className="relative flex items-start gap-4 pl-8">
                            <div className="absolute left-0 p-1 bg-blue-100 rounded-full z-10">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Pickup</p>
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {order?.pickupLocation?.municipality}, {order?.pickupLocation?.district}
                                </p>
                                <p className="text-xs text-slate-500">{order?.pickupLocation?.landmark || "Standard Pickup"}</p>
                            </div>
                        </div>
                        {/* Dropoff */}
                        <div className="relative flex items-start gap-4 pl-8">
                            <div className="absolute left-0 p-1 bg-red-100 rounded-full z-10">
                                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-red-600 uppercase">Destination</p>
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {order?.destinationLocation?.municipality}, {order?.destinationLocation?.district}
                                </p>
                                <p className="text-xs text-slate-500">{order?.destinationLocation?.landmark || "Final Delivery"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                <Truck size={14} className="text-slate-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{order?.transporter?.name || "Assigning..."}</span>
                        </div>
                        <button className="text-[10px] font-bold text-blue-600 hover:underline">CONTACT</button>
                    </div>
                </div>
            </div>

            {/* 🌍 Map Container */}
            <MapContainer
                center={[order?.pickupLocation?.latitude || 27.7, order?.pickupLocation?.longitude || 85.3]}
                zoom={11}
                zoomControl={false}
                className="h-full w-full z-0"
                style={{ filter: "contrast(1.1) brightness(1.05)" }}
            >
                <TileLayer 
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {order?.pickupLocation && (
                    <Marker position={[order.pickupLocation.latitude, order.pickupLocation.longitude]}>
                        <Popup className="custom-popup">
                            <div className="font-sans p-1">
                                <p className="font-bold text-blue-600">Pickup Point</p>
                                <p className="text-xs text-slate-600">{order.pickupLocation.municipality}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {order?.destinationLocation && (
                    <Marker position={[order.destinationLocation.latitude, order.destinationLocation.longitude]}>
                        <Popup>
                            <div className="font-sans p-1">
                                <p className="font-bold text-red-600">Drop-off Point</p>
                                <p className="text-xs text-slate-600">{order.destinationLocation.municipality}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {order?.pickupLocation && order?.destinationLocation && (
                    <Routing pickup={order.pickupLocation} drop={order.destinationLocation} />
                )}
            </MapContainer>

            {/* Custom CSS for Leaflet UI cleanup */}
            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-bar { border: none !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; }
                .leaflet-routing-container { display: none; }
                .leaflet-popup-content-wrapper { border-radius: 12px; padding: 4px; }
            `}} />
        </div>
    );
};

export default DeliveryLocationVisualization;