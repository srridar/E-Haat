import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BUYER_API_END_POINT } from "@/utils/constants";
import LocationPicker from "@/components/LocationPicker";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Edit3,
  XCircle,
  Save,
  Map as MapIcon
} from "lucide-react";


const BuyerLocationUpdation = () => {
  const navigate = useNavigate();
  const [addressLoading, setAddressLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading , setLoading] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);
  const [location, setLocation] = useState({
    latitude: 27.7172,
    longitude: 85.3240,
    address: "Kathmandu, Nepal",
  });

  useEffect(() => {
    const fetchExistingLocation = async () => {
      try {
        setAddressLoading(true);
        const res = await axios.get(`${BUYER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success && res.data.data?.location) {
          const loc = res.data?.data?.location;
          const initialData = {
            latitude: loc?.coordinates?.[1] ?? 27.7172,
            longitude: loc?.coordinates?.[0] ?? 85.3240,
            address: loc?.city || "Saved Location",
          };

          setLocation(initialData);
          setSavedLocation(initialData);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        toast.error("Failed to load saved location");
      } finally {
        setAddressLoading(false);
      }
    };
    fetchExistingLocation();
  }, []);



  const fetchAddress = async (lat, lng) => {
    setAddressLoading(true);
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "np" } }
      );
      setLocation((prev) => ({ ...prev, address: data.display_name || "Custom Pin" }));
    } catch (err) {
      setLocation((prev) => ({ ...prev, address: "Manual location pin" }));
      toast.error("Could not fetch address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleLocationSelect = ([lat, lng]) => {
    if (!isEditMode) return;
    setLocation(prev => ({ ...prev, latitude: lat, longitude: lng }));
    fetchAddress(lat, lng);
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
    toast.info("Edit mode enabled. Click map to change location.");
  };

  const cancelEdit = () => {
    if (savedLocation) setLocation(savedLocation);
    setIsEditMode(false);
    toast.warning("Changes discarded");
  };

  const submitHandler = async () => {
    setLoading(true);
    const promise = axios.put(
      `${BUYER_API_END_POINT}/setlocation`,
      {
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
          city: location.address
        }
      },
      { withCredentials: true }
    );

    toast.promise(promise, {
      loading: "Updating location...",
      success: (res) => {
        if (res.data.success) {
          setSavedLocation(location);
          setIsEditMode(false);
          return "Location updated successfully!";
        }
        throw new Error("Update failed");
      },
      error: (err) =>
        err.response?.data?.message || "Failed to update location"
    });

    try {
      await promise;
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-4 font-sans">

      <div className="max-w-7xl mx-auto mb-6 py-2 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="flex gap-3">
          {isEditMode ? (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-all shadow-sm text-sm font-black uppercase tracking-tighter"
            >
              <XCircle size={18} /> Discard Changes
            </button>
          ) : (
            <button
              onClick={toggleEditMode}
              className="flex items-center gap-2 bg-orange-600 px-5 py-2.5 rounded-xl text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 text-sm font-black uppercase tracking-tighter"
            >
              <Edit3 size={18} /> Update Your Area
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isEditMode ? 'bg-orange-600' : 'bg-slate-800'} p-3 rounded-2xl text-white transition-colors`}>
                <MapIcon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isEditMode ? "Select New Base" : "Current Location"}
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${isEditMode ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                  {isEditMode ? "Editing Active" : "View Only"}
                </span>
              </div>
            </div>


            <div className={`p-5 rounded-2xl border-2 transition-all ${isEditMode ? 'border-orange-200 bg-orange-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Location Address</span>
              {addressLoading ? (
                <div className="flex items-center gap-2 py-1 animate-pulse">
                  <div className="h-2 w-2 bg-orange-500 rounded-full" />
                  <span className="text-sm font-bold text-slate-400 italic">Updating...</span>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-800 leading-snug">
                  {location.address}
                </p>
              )}
            </div>

            {isEditMode && (
              <div className="mt-8">
                <button
                  onClick={submitHandler}
                  disabled={addressLoading}
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Save Changes <Save size={16} /></>}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-bold">
                  Your profile will be updated immediately.
                </p>
              </div>
            )}
          </div>

          {!isEditMode && (
            <div className="bg-green-50 p-6 rounded-[1.5rem] border border-green-100 flex gap-4">
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              <p className="text-xs text-green-800 font-bold leading-relaxed">
                This is your verified service location. Transporter can serve you within this area
              </p>
            </div>
          )}
        </div>

        <div className={`lg:col-span-8 bg-white p-3 rounded-[3rem] shadow-sm border transition-all h-[530px] relative overflow-hidden ${isEditMode ? 'border-orange-400 ring-4 ring-orange-50' : 'border-slate-200'}`}>
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <LocationPicker
              key={`${location.latitude}-${location.longitude}`}
              onSelect={handleLocationSelect}
              currentCoords={[location.latitude, location.longitude]}
              isEditable={isEditMode}
            />
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className={`${isEditMode ? 'bg-orange-600' : 'bg-slate-900/80'} backdrop-blur-md text-white text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-2xl transition-colors`}>
              {isEditMode ? "Click Map to Change Location" : "Location Locked"}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default BuyerLocationUpdation;