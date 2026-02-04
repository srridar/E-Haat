import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, Truck, MapPin, User, Phone } from "lucide-react";
import { Label } from '@/components/ui/label';
import { TRANSPORTER_API_END_POINT } from '@/utils/constants'
import axios from 'axios';

const TransporterProfileUpdate = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceAreas: "",
    pricePerKm: "",
    isAvailable: false,
    profileImage: null,

  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({});


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${TRANSPORTER_API_END_POINT}/profile`, { withCredentials: true });

        if (res.data.success) {
          const b = res.data.transporter;
          console.log(res.data.transporter);
          setFormData({
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            serviceAreas: b.serviceAreas || "",
            pricePerKm: b.pricePerKm || "",
            isAvailable: b.isAvailable || false,
            profileImage: null,
          });
          setInitialData({
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            serviceAreas: b.serviceAreas || "",
            pricePerKm: b.pricePerKm || "",
            isAvailable: b.isAvailable || false,
            profileImage: null,
          });
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, []);



  const validateInput = () => {
    const errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^(?:\+977|977)?9[678]\d{8}$/;

    if (formData.name && formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    if (formData.email && !emailReg.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.phone && !phoneReg.test(formData.phone)) {
      errors.phone = "Please enter a valid Nepali phone number";
    }
    if (formData.pricePerKm && formData.pricePerKm < 0) {
      errors.pricePerKm = "Price per KM cannot be negative";
    }
    if (formData.pricePerKm && formData.pricePerKm > 100) {
      errors.pricePerKm = "Price per KM cannot be greater than 100";
    }

    return errors;
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const changeFileHandler = (e) => {
    setFormData(prev => ({
      ...prev,
      profileImage: e.target.files?.[0] || null
    }));
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

      if (formData.name) data.append("name", formData.name);
      if (formData.email) data.append("email", formData.email);
      if (formData.phone) data.append("phone", formData.phone);
      if (formData.profileImage) data.append("profileImage", formData.profileImage);
      if (formData.serviceAreas) data.append("serviceAreas", formData.serviceAreas);
      if (formData.pricePerKm) data.append("pricePerKm", formData.pricePerKm);
      data.append("isAvailable", formData.isAvailable);
      console.log(data);
      const res = await axios.patch(`${TRANSPORTER_API_END_POINT}/profile/update`, data, {
        withCredentials: true, headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        navigate('/transporter/profile');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">


        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors font-medium" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back to Profile
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
            <p className="text-sm text-slate-500">Update your public information and vehicle details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 bg-slate-100 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <User size={48} />
                  </div>
                </div>
                <button className="absolute -bottom-2 -right-2 bg-orange-500 p-2 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-4 font-bold text-slate-800">{formData.name || "No Name"}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Transporter ID: #9921</p>

            </div>
          </div>


          <form className="lg:col-span-2 space-y-6 " onSubmit={handleSubmit}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <User size={20} className="text-orange-500" />
                <h2 className="font-bold text-lg">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">email</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        name="profileImage"
                        className="hidden"
                        onChange={changeFileHandler}
                      />
                      <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition">
                        Upload Image
                      </span>
                    </label>
                    {formData.profileImage && (
                      <span className="text-sm">{formData.profileImage.name}</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Service Areas (Comma separated)</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="serviceAreas"
                      value={formData.serviceAreas}
                      onChange={handleChange}
                      placeholder="e.g. Kathmandu, Bhaktapur"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                    />
                    {errors.serviceAreas && (
                      <p className="text-red-500 text-sm mt-1">{errors.serviceAreas}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* VEHICLE LOGISTICS SECTION */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Truck size={20} className="text-blue-500" />
                <h2 className="font-bold text-lg">Vehicle Logistics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Base Rate per KM (Rs.)</label>
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-bold text-emerald-600"
                  />
                  {errors.pricePerKm && (
                    <p className="text-red-500 text-sm mt-1">{errors.pricePerKm}</p>
                  )}
                </div>
                <div className="space-y-2 flex items-center gap-3 justify-center">
                  <label className="text-sm font-semibold text-slate-600">Transporter Available ?</label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />

                </div>
              </div>
            </div>


            <div className="flex items-center justify-end gap-4 pt-4">
              <button type="button" className="px-6 py-2.5 rounded-xl font-semibold text-red-400 hover:bg-slate-100 transition-all outline-2-red-500 border border-red-300" onClick={() => setFormData(initialData)}>
                Cancel
              </button>
              <button disabled={loading} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-slate-200">
                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfileUpdate;