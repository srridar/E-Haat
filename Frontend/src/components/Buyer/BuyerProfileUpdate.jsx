import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPicker from "@/components/LocationPicker";
import { BUYER_API_END_POINT } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import validator from "validator";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Trash2,
  CheckCircle2
} from "lucide-react";

const BuyerProfileUpdate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    latitude: null,
    longitude: null,
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BUYER_API_END_POINT}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const b = res.data.data;

          const mappedData = {
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.location?.city || "",
            latitude: b.location?.coordinates?.[1] || null,
            longitude: b.location?.coordinates?.[0] || null,
            file: null,
          };

          setFormData(mappedData);
          setInitialData(mappedData);
          setOriginalImage(b.profileImage?.url || "");
          setPreview(b.profileImage?.url || "");
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, []);

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);

      setFormData((prev) => ({ ...prev, file }));
      setPreview(objectUrl);

      // Cleanup memory
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // ================= LOCATION =================
  const handleLocationSelect = ([lat, lng]) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  // ================= VALIDATION =================
  const validateInput = () => {
    const errors = {};
    const phoneReg = /^(?:\+977|977)?(98|97)\d{8}$/;

    if (!formData.name || formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!formData.email || !validator.isEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone || !phoneReg.test(formData.phone)) {
      errors.phone = "Invalid Nepali mobile number";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.latitude || !formData.longitude) {
      errors.location = "Location is required";
    }

    return errors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "file" && formData.file) {
          data.append("profileImage", formData.file);
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.put(
        `${BUYER_API_END_POINT}/update-profile`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/buyer/profile");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DISCARD =================
  const handleDiscard = () => {
    setFormData(initialData);
    setPreview(originalImage);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 md:p-10 relative">
      <div className="absolute top-0 w-full h-48 bg-emerald-600 -z-0" />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-white flex items-center gap-2 font-bold z-10 hover:text-emerald-100 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Profile
      </button>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12 border border-slate-100">
        
        {/* LEFT SECTION */}
        <div className="lg:col-span-4 bg-emerald-50/50 p-10 flex flex-col items-center border-r border-slate-100">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={
                  preview
                    ? preview
                    : `https://ui-avatars.com/api/?name=${formData.name}&background=10b981&color=fff`
                }
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>

            <label className="absolute bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-2xl cursor-pointer hover:bg-emerald-700 transition-all shadow-lg hover:scale-110 active:scale-95">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-xl font-black text-slate-800">
              {formData.name || "Buyer Name"}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Updating personal details
            </p>
          </div>

          <div className="mt-auto w-full pt-10">
            <button
              type="button"
              onClick={handleDiscard}
              className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-white rounded-2xl transition-all border-2 border-transparent hover:border-slate-100"
            >
              <Trash2 size={18} /> Discard Changes
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-8 p-8 md:p-14">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Profile Settings
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Ensure your contact info is up to date for deliveries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name", icon: <User size={16}/> },
                { label: "Email Address", name: "email", icon: <Mail size={16}/> },
                { label: "Phone Number", name: "phone", icon: <Phone size={16}/> },
                { label: "Primary City", name: "city", icon: <MapPin size={16}/> },
              ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {field.label}
                  </Label>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      {field.icon}
                    </div>

                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all font-medium text-sm
                        ${errors[field.name]
                          ? "border-red-200 focus:border-red-500"
                          : "border-transparent focus:border-emerald-500 focus:bg-white"
                        }`}
                    />
                  </div>

                  {errors[field.name] && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <MapPin size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Update Home Location
                </h3>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                <LocationPicker onSelect={handleLocationSelect} />
              </div>

              {formData.latitude && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl w-fit border border-emerald-100">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <p className="text-[11px] font-bold text-emerald-700">
                    GPS COORDINATES UPDATED
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-[2rem] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Syncing Data...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>

            {errors.location && (
              <p className="text-red-500 text-xs font-bold text-center">
                {errors.location}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfileUpdate;