import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SELLER_API_END_POINT } from '@/utils/constants'
import LocationPicker from '@/components/LocationPicker'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Loader2,
  Sprout,
  AlertCircle
} from "lucide-react";



const SellerRegister = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    latitude: null,
    longitude: null
  })

  const navigate = useNavigate()


  const validateForm = () => {
    let newErrors = {};
    const emailReg = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneReg = /^(98|97)\d{8}$/;

    if (!input.name.trim()) newErrors.name = "Business name is required";
    if (input.name.trim().length < 3) newErrors.name = "Name seems too short";
    if (/[^a-zA-Z\s]/.test(input.name.trim())) newErrors.name = "Name cannot contain special characters or numbers";

    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailReg.test(input.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!input.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneReg.test(input.phone)) {
      newErrors.phone = "Enter a valid 10-digit number";
    }

    if (!input.city.trim()) newErrors.city = "City is required";
    if (input.city.trim().length < 3) newErrors.city = "City name seems too short";
    if (/[^a-zA-Z\s]/.test(input.city.trim())) newErrors.city = "City name cannot contain special characters or numbers";

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (!passwordReg.test(input.password)) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!input.latitude || !input.longitude) {
      newErrors.location = "Please select your store location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  const handleLocationSelect = ([lat, lng]) => {
    setInput(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
    if (errors.location) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated.location;
        return updated;
      });
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${SELLER_API_END_POINT}/register`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )
      if (res.data.success) {
        toast.success("Account created successfully!");
        navigate("/seller/login")
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ed] p-4 lg:p-4 relative overflow-hidden">
      <button onClick={() => navigate("/")} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-all font-bold group">
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={20} />
        </div>
        <span>Back Home</span>
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 overflow-hidden relative z-10 border border-orange-50">

        <div className="lg:col-span-4 bg-gradient-to-b from-orange-50 to-white p-6 hidden lg:flex flex-col justify-between border-r border-orange-50">
          <div>
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg shadow-orange-200">
              <Store size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Grow Your Business with E-Haat.</h2>
            <p className="text-slate-600 mt-3 text-sm font-medium leading-relaxed">
              List your farm-fresh products and reach thousands of buyers in your local area instantly.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <Sprout size={150} className="text-orange-600 opacity-10" />
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">Partner with us today</p>
          </div>
        </div>


        <div className="lg:col-span-8 p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900">Seller Registration</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create your digital storefront in minutes.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600 border-b border-orange-50 pb-2">
                <Store size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Business Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Business/Full Name", name: "name", placeholder: "e.g. Green Valley Farms", icon: <User size={16} /> },
                  { label: "Business Email", name: "email", placeholder: "contact@farm.com", icon: <Mail size={16} /> },
                  { label: "Phone Number", name: "phone", placeholder: "98XXXXXXXX", icon: <Phone size={16} /> },
                  { label: "Operating City", name: "city", placeholder: "e.g. Biratnagar", icon: <MapPin size={16} /> },
                  { label: "Secure Password", name: "password", placeholder: "Create a password", icon: <Lock size={16} /> },
                ].map((field, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</div>
                      <input
                        type={"text"}
                        name={field.name}
                        value={input[field.name]}
                        placeholder={field.placeholder}
                        onChange={changeEventHandler}
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-medium ${errors[field.name] ? 'border-red-500' : 'border-transparent focus:border-orange-500'}`}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className={`bg-green-50 border rounded-xl p-3 text-sm transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-green-200'}`}>
                  <p className={`text-[10px] font-bold uppercase mb-1 ${errors.password ? 'text-red-600' : 'text-green-700'}`}>Password Requirements:</p>
                  <ul className={`text-[11px] list-disc list-inside space-y-0.5 ${errors.password ? 'text-red-500' : 'text-green-600'}`}>
                    <li>At least 8 characters</li>
                    <li>One uppercase & one number</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 ">
              <div className="flex items-center gap-2 text-orange-600 border-b border-orange-50 pb-2">
                <MapPin size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Store Location</h3>
              </div>

              <div className={`h-[400px] rounded-[2rem] overflow-hidden border-4 shadow-inner relative group ${errors.location ? "border-red-200" : "border-slate-50"
                }`}>
                <LocationPicker
                  key={`${input.latitude || 0}-${input.longitude || 0}`}
                  onSelect={handleLocationSelect}
                  currentCoords={
                    input.latitude && input.longitude
                      ? [input.latitude, input.longitude]
                      : [27.7172, 85.3240]
                  }
                  isEditable={true}
                />
              </div>

              {errors.location && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.location}
                </p>
              )}

              {input.latitude && (
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl w-fit border border-orange-100">
                  <span className="animate-pulse w-2 h-2 bg-orange-500 rounded-full" />
                  <p className="text-[11px] font-bold text-orange-700 uppercase tracking-tighter">
                    GPS Pin Dropped: {input.latitude.toFixed(4)}, {input.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Creating Store...</>
                ) : (
                  "Start Selling on E-Haat"
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-6 font-medium">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/seller/login')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Seller Log In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellerRegister