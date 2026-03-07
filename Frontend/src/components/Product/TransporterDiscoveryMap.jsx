import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { Truck, MapPin, ChevronLeft, Loader2, Star, AlertCircle } from "lucide-react";

// Fix for default Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const transporterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

// SAFETY: Helper to validate coordinates before they reach Leaflet
const isValidCoord = (lat, lng) => {
  return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
};

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (isValidCoord(center[0], center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const TransporterDiscoveryMap = () => {
  const navigate = useNavigate();
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kathmandu Default
  const DEFAULT_CENTER = [27.7172, 85.3240];

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const res = await axios.get(`${ADMIN_API_END_POINT}/verified-transporters`, { withCredentials: true });
        if (res.data?.success) {
          const validOnes = res.data.transporters.filter(t => {
            const coords = t.location?.coordinates;
            if (!coords || coords.length < 2) return false;
            return !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]));
          });
          setTransporters(validOnes);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransporters();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-orange-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium tracking-tight">Accessing High-Detail Satellite Data...</p>
    </div>
  );

  return (
    <div className="h-screen w-full relative overflow-hidden  font-sans">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-2xl">
        <div className="bg-white/95 backdrop-blur shadow-xl border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-200">
              <Truck className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Transporter Map</h2>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {transporters.length} Units Active
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1" >
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-3xl"
      >
        <MapController center={DEFAULT_CENTER} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {transporters.map((t) => {

          const lng = parseFloat(t.location.coordinates[0]);
          const lat = parseFloat(t.location.coordinates[1]);

          if (!isValidCoord(lat, lng)) return null;

          return (
            <Marker key={t._id} position={[lat, lng]} icon={transporterIcon}>
              <Popup>
                <div className="w-56 overflow-hidden bg-white rounded-lg">
                  <div className="h-16 w-full bg-slate-100 relative overflow-hidden rounded-t-lg">
                    <img
                      src= {t?.profileImage?.url || `https://ui-avatars.com/api/?name=${t?.name || 'User'}&background=10b981&color=fff`} 
                      alt="logistics"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-3">
                      <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                        Verified Partner
                      </span>
                    </div>
                  </div>

                  <div className="p-3">

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-extrabold text-slate-900 text-[13px] leading-tight truncate pr-2">
                        {t.name}
                      </h3>
                      <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded border border-green-100 shrink-0">
                        <Star size={10} className="text-green-600 fill-green-600" />
                        <span className="text-[10px] ml-0.5 font-bold text-green-700 italic">4.9</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                        <Truck size={10} className="text-orange-600" /> 24/7 Service
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                        <MapPin size={10} className="text-orange-600" /> Nearby
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-400 mb-4 px-0.5">
                      <p className="text-[10px] leading-snug line-clamp-2">
                        {t.location?.address || "Building location verified by logistics team"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => navigate(`/buyer/transporter-details/${t._id}`)}
                        className="w-full bg-slate-900 hover:bg-orange-600 text-white text-[11px] font-bold py-2 rounded-md transition-all active:scale-[0.98] shadow-sm shadow-slate-200"
                      >
                        View Full Details
                      </button>
                      <button
                        className="w-full bg-white border border-slate-200 text-slate-700 text-[10px] font-bold py-1.5 rounded-md hover:bg-slate-50"
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 16px !important; padding: 4px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important; }
        .leaflet-popup-tip { display: none; }
        .leaflet-bar { border: none !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; border-radius: 12px !important; overflow: hidden; }
        .leaflet-bar a { background: white !important; color: #64748b !important; border: 1px solid #e2e8f0 !important; }
      `}</style>
    </div>
  );
};

export default TransporterDiscoveryMap;