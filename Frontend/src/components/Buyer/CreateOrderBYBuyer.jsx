import React, { useState } from "react";
import {
  MapPin,
  Package,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CreditCard,
  ShieldCheck,
  Compass,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ORDER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import LocationPicker from '@/components/LocationPicker';

const CreateOrderByBuyer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Dynamic Redux state fallbacks to prevent crashes
  const { items = [], totalAmount = 0, clearCart } = useSelector((state) => state.cart || {});
  
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [deliveryLocation, setDeliveryLocation] = useState({
    province: "",
    district: "",
    municipality: "",
    ward: "",
    landmark: "",
    latitude: null,
    longitude: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Proactively wipe field validation errors on user keystroke
    if (errors[name]) {
      setErrors((prev) => {
        const cleanErrors = { ...prev };
        delete cleanErrors[name];
        return cleanErrors;
      });
    }
  };

  const handleLocationSelect = ([lat, lng]) => {
    setDeliveryLocation((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    if (errors.location) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.location;
        return updated;
      });
    }
  };

  //     Geolocation Integration Feature
  const handleDetectDeviceLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Your current browser interface does not support satellite coordinate streaming.");
    }

    setGeoLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLocation((prev) => ({
          ...prev,
          latitude,
          longitude
        }));
        
        toast.success("Device telemetry coordinates synchronized successfully.");
        setGeoLoading(false);
        
        if (errors.location) {
          setErrors((prev) => {
            const clean = { ...prev };
            delete clean.location;
            return clean;
          });
        }
      },
      (error) => {
        console.error("Spatial tracking error encountered:", error);
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location handshake rejected. Please allow permissions manually in browser header.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Network coordinates isolated or position timeout. Use map selector.");
            break;
          default:
            toast.error("Telemetry hardware initialization failed.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validateForm = () => {
    const localErrors = {};
    if (!deliveryLocation.province.trim()) localErrors.province = "Province is required";
    if (!deliveryLocation.district.trim()) localErrors.district = "District is required";
    if (!deliveryLocation.municipality.trim()) localErrors.municipality = "Local body assignment required";
    if (!deliveryLocation.latitude || !deliveryLocation.longitude) {
      localErrors.location = "Pinpoint telemetry target on map interface or auto-detect is mandatory";
    }
    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      return toast.error("Transaction aborted: Checkout manifest parameters reflect an empty cart state.");
    }

    if (!validateForm()) {
      return toast.error("Validation error: Please review highlighted address inputs.");
    }

    try {
      setLoading(true);

      const formattedProducts = items.map((item) => ({
        productId: item.productId || item._id,
        quantity: item.quantity,
      }));

      console.log(" formatted products payload for order creation:", formattedProducts);

      const res = await axios.post(`${ORDER_API_END_POINT}/place-order`,
        {
          products: formattedProducts,
          deliveryLocation,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Order initialized successfully.");
        if (clearCart) dispatch(clearCart());
        navigate(`/buyer/order-success/${res.data.order?._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to establish checkout request upstream.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* STRUCTURAL INTERACTIVE HEADER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center bg-white hover:bg-slate-900 border border-slate-200 transition-all p-2.5 rounded-xl shadow-sm text-slate-500 hover:text-white"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-extrabold block">Secure Checkout Gateway</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">Review & Confirm Request</h1>
          </div>
        </div>

        {/* COMPACT FULL-PAGE DASHBOARD CONTAINER */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* LEFT CONTAINER: FIXED META MANIFEST HIGHLIGHTS */}
            <div className="bg-slate-950 text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

              <div className="space-y-8 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-indigo-400 text-[11px] font-semibold tracking-wide">
                    <ShieldCheck size={14} /> TLS Secure Handshake Verified
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight mt-4">Order Topology</h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Verify multi-vendor distribution properties and systemic price variables before settlement commitment.
                  </p>
                </div>

                {/* KPI METRIC MATRIX SHARDS */}
                <div className="space-y-3.5">
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Payload Units</p>
                      <h3 className="text-base font-bold text-slate-200 mt-0.5">{items.length} Distinct Variant(s)</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fulfillment Protocol</p>
                      <h3 className="text-sm font-bold text-slate-200 mt-0.5 tracking-wide">Cash On Delivery (COD)</h3>
                    </div>
                  </div>

                  {/* HIGH METRIC BALANCE STATEMENT BANNER */}
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 border border-indigo-500/20 shadow-md">
                    <p className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">Consolidated Financial Gross</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-white">Rs {totalAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-indigo-200 font-bold font-mono">NPR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROUTING FOOTNOTE BLOCK */}
              <div className="mt-8 lg:mt-0 bg-slate-900/50 border border-slate-850 rounded-xl p-3.5 relative z-10">
                <div className="flex gap-2.5 items-start">
                  <Truck className="text-amber-400 shrink-0 mt-0.5" size={15} />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-200 font-semibold">Distributed Logistics Notice:</strong> Packages will split organically according to cross-province merchant source locations for optimal transport times.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTAINER: DYNAMIC ADDRESS MODAL FORMS */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-10 bg-slate-50/30 space-y-8">
              
              {/* TARGET METRICS SUBSECTION */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Delivery Endpoint Allocation</h2>
                      <p className="text-[11px] text-slate-400">Ensure values match your localized governance naming maps</p>
                    </div>
                  </div>
                  
                  {/* SATELLITE GPS ACQUISITION MODULE BUTTON */}
                  <button
                    type="button"
                    onClick={handleDetectDeviceLocation}
                    disabled={geoLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 rounded-xl text-[11px] font-bold text-indigo-600 hover:text-white transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {geoLoading ? <Loader2 size={13} className="animate-spin" /> : <Compass size={13} />}
                    {geoLoading ? "Interrogating GPS..." : "Detect My Location"}
                  </button>
                </div>

                {/* GRID FORM STRUCTURAL DESIGN ELEMENTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Province <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="province"
                      value={deliveryLocation.province}
                      onChange={handleChange}
                      placeholder="e.g. Lumbini"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50/40 ${errors.province ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : 'border-slate-200'}`}
                    />
                    {errors.province && <p className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10}/> {errors.province}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">District <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="district"
                      value={deliveryLocation.district}
                      onChange={handleChange}
                      placeholder="e.g. Rupandehi"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50/40 ${errors.district ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : 'border-slate-200'}`}
                    />
                    {errors.district && <p className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10}/> {errors.district}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Municipality / Sub-Metropolitan <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="municipality"
                      value={deliveryLocation.municipality}
                      onChange={handleChange}
                      placeholder="e.g. Butwal"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50/40 ${errors.municipality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : 'border-slate-200'}`}
                    />
                    {errors.municipality && <p className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10}/> {errors.municipality}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Ward Designation</label>
                    <input
                      type="text"
                      name="ward"
                      value={deliveryLocation.ward}
                      onChange={handleChange}
                      placeholder="e.g. 04"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50/40"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Street Address Spec / Notable Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={deliveryLocation.landmark}
                      onChange={handleChange}
                      placeholder="e.g. Near Traffic Chowk, Behind Apex Bank Tower"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50/40"
                    />
                  </div>
                </div>

                {/* GEOSPATIAL MAP VISUAL EMBED COMPONENT MODULE */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Spatial Positioning Map Anchor</label>
                    {deliveryLocation.latitude && deliveryLocation.longitude && (
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold animate-pulse">
                        Lat: {deliveryLocation.latitude.toFixed(4)}, Lng: {deliveryLocation.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                  <div className={`h-[280px] rounded-2xl overflow-hidden border-2 shadow-inner relative group transition-all duration-300 ${errors.location ? "border-red-300 ring-4 ring-red-500/5" : "border-slate-100"}`}>
                    <LocationPicker
                      key={`${deliveryLocation.latitude || 0}-${deliveryLocation.longitude || 0}`}
                      onSelect={handleLocationSelect}
                      currentCoords={
                        deliveryLocation.latitude && deliveryLocation.longitude
                          ? [deliveryLocation.latitude, deliveryLocation.longitude]
                          : [27.7172, 85.3240] // Default Kathmandu Capital Fallback Mesh Coordinates
                      }
                      isEditable={true}
                    />
                  </div>
                  {errors.location && <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={11}/> {errors.location}</p>}
                </div>
              </div>

              {/* LINE ITEMIZED LEDGER BREAKDOWN SECTION */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Manifest Validation Roll</h2>
                    <p className="text-[11px] text-slate-400">Verifiable item mapping nodes active inside checkout pipeline</p>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                    <ShoppingBag className="mx-auto text-slate-300 mb-2" size={28} />
                    <p className="text-slate-400 text-xs font-semibold">Your dynamic checkout manifest contains zero entries.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                      {items.map((item, index) => {
                        const itemTotal = item.price * item.quantity;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-50/40 hover:bg-slate-50 border border-slate-100/70 hover:border-slate-200 rounded-xl p-3 transition-all duration-150 group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/placeholder-item.png"}
                                alt={item.name}
                                className="w-11 h-11 rounded-lg object-cover border border-slate-200 bg-white group-hover:scale-105 transition-transform duration-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 text-xs truncate max-w-[180px] sm:max-w-xs">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Rs {item.price.toLocaleString()} &times; {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                              Rs {itemTotal.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Gross Settlement Value</p>
                        <p className="text-[10px] text-slate-400">Inclusive of transactional logistics adjustments</p>
                      </div>
                      <p className="text-xl font-black text-indigo-600 tracking-tight">
                        Rs {totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={loading || items.length === 0}
                  className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-indigo-600/10 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Processing Dispatch Pipeline...</span>
                    </>
                  ) : (
                    <span>Commit and Confirm Purchase</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderByBuyer;