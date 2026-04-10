import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BUYER_API_END_POINT } from '@/utils/constants'
import LocationPicker from '@/components/LocationPicker'
import axios from 'axios'
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Loader2, ShoppingBag, AlertCircle } from "lucide-react";
import { Label } from '@/components/ui/label'
import { toast } from "react-toastify";

const BuyerRegister = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Local validation errors
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

    if (!input.name.trim()) newErrors.name = "Full name is required";
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
      newErrors.location = "Please pin your delivery address on the map";
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
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${BUYER_API_END_POINT}/register`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )
      if (res.data.success) {
        toast.success("Welcome to E-Haat! 🎉");
        navigate("/buyer/login")
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-2 lg:p-4 relative overflow-hidden">

      <button onClick={() => navigate("/")} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors font-bold group">
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={20} />
        </div>
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-emerald-100">

        {/* Branding Side */}
        <div className="lg:col-span-4 bg-emerald-50 p-8 hidden lg:flex flex-col justify-between border-r border-emerald-100">
          <div>
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-3xl font-black text-emerald-900 leading-tight">Join the Marketplace.</h2>
            <p className="text-emerald-700/70 mt-4 text-sm font-medium leading-relaxed">
              Create your buyer account to access fresh, local produce directly from the source.
            </p>
          </div>

          <div className="relative">
            <img src="/crop1.png" alt="Fresh Produce" className="h-[24rem] w-[24rem] object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-8 p-6 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Buyer Registration</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Connect with local sellers in your area.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 border-b border-emerald-50 pb-2">
                <User size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Account Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Full Name", name: "name", placeholder: "e.g. Rahul Khatri", icon: <User size={16} /> },
                  { label: "Email Address", name: "email", placeholder: "rahul@example.com", icon: <Mail size={16} /> },
                  { label: "Mobile Number", name: "phone", placeholder: "98XXXXXXXX", icon: <Phone size={16} /> },
                  { label: "City", name: "city", placeholder: "e.g. Baglung", icon: <MapPin size={16} /> },
                  { label: "Password", name: "password", placeholder: "Create password", icon: <Lock size={16} /> },
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
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium ${errors[field.name] ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className={`bg-emerald-50/50 border rounded-xl p-3 text-sm transition-all ${errors.password ? 'border-red-200 bg-red-50' : 'border-emerald-100'}`}>
                  <p className={`text-[10px] font-bold uppercase mb-1 ${errors.password ? 'text-red-600' : 'text-emerald-700'}`}>Security Check:</p>
                  <ul className={`text-[11px] list-disc list-inside space-y-0.5 ${errors.password ? 'text-red-500' : 'text-emerald-600'}`}>
                    <li>Min. 8 characters</li>
                    <li>Uppercase, Number & Special Char</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 border-b border-emerald-50 pb-2">
                <MapPin size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Delivery Location</h3>
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
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl w-fit border border-emerald-100">
                  <span className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full" />
                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-tighter">
                    Coords Locked: {input.latitude.toFixed(4)}, {input.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Securing Account...</>
                ) : (
                  "Create My Buyer Account"
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-6 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/buyer/login')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyerRegister





