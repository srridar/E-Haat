import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, Save, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import LocationPicker from '@/components/LocationPicker';
import { SELLER_API_END_POINT } from '@/utils/constants';
import { Label } from '@/components/ui/label';

const SellerProfileUpdate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", file: null, city: "", latitude: null, longitude: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${SELLER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success) {
          const b = res.data.data;
          const data = {
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.city || "",
            latitude: b.latitude || null,
            longitude: b.longitude || null,
            file: null,
          };
          setFormData(data);
          setInitialData(data);
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const changeFileHandler = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const handleLocationSelect = ([lat, lng]) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const validateInput = () => {
    const errors = {};
    const emailReg = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    const phoneReg = /^(?:\+977|977)?9[678]\d{8}$/;

    if (formData.name && formData.name.length < 3) errors.name = "Name must be at least 3 characters";
    if (formData.email && !emailReg.test(formData.email)) errors.email = "Invalid email address";
    if (formData.phone && !phoneReg.test(formData.phone)) errors.phone = "Invalid Nepali phone number";
    if (/[^a-zA-Z\s]/.test(formData.city.trim())) errors.city = "City cannot contain special characters or numbers";

    return errors;
  };

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
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          if (key === 'file' && formData.file) data.append("profileImage", formData.file);
          else data.append(key, formData[key]);
        }
      });

      const res = await axios.put(`${SELLER_API_END_POINT}/update-profile`, data, { withCredentials: true });
      if (res.data.success) navigate('/seller/profile');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb/Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h2 className="text-3xl font-bold">Account Settings</h2>
            <p className="text-emerald-100 mt-2">Update your seller profile and location details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                label="Full Name" 
                icon={<User className="w-4 h-4" />}
                name="name"
                value={formData.name}
                error={errors.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              <InputGroup 
                label="Email Address" 
                icon={<Mail className="w-4 h-4" />}
                name="email"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              <InputGroup 
                label="Phone Number" 
                icon={<Phone className="w-4 h-4" />}
                name="phone"
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
              />
              <InputGroup 
                label="City" 
                icon={<MapPin className="w-4 h-4" />}
                name="city"
                value={formData.city}
                error={errors.city}
                onChange={handleChange}
                placeholder="Kathmandu"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Profile Picture Section */}
            <div>
              <Label className="text-slate-700 font-semibold mb-3 block">Profile Image</Label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center border shadow-sm">
                  <Camera className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={changeFileHandler}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Choose New Photo
                  </label>
                  {formData.file && <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {formData.file.name}</p>}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold block">Store Location</Label>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-[300px] relative">
                <LocationPicker onSelect={handleLocationSelect} />
              </div>
              {formData.latitude && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3" />
                  Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFormData(initialData)}
                className="flex items-center px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-all active:scale-95"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component for cleaner JSX
const InputGroup = ({ label, icon, error, ...props }) => (
  <div className="space-y-1.5">
    <Label className="text-slate-700 font-medium ml-1">{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl transition-all outline-none focus:ring-4 ${
          error 
          ? 'border-red-400 focus:ring-red-100' 
          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-50'
        }`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

export default SellerProfileUpdate;