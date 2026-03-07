import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRANSPORTER_API_END_POINT } from '@/utils/constants'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { toast } from "react-toastify"
import { ArrowLeft, User, Mail, Lock, Phone, Truck, Loader2, AlertCircle } from "lucide-react";

const TransporterRegister = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })

  const navigate = useNavigate()

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    let newErrors = {};
    const emailReg = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    // Requirements: 8+ chars, 1 Upper, 1 Number, 1 Special Char
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneReg = /^(98|97)\d{8}$/;

    if (!input.name.trim()) newErrors.name = "Full name is required";
    if(input.name.trim().length < 3) newErrors.name = "Name seems too short";
    if(/[^a-zA-Z\s]/.test(input.name.trim())) newErrors.name = "Name cannot contain special characters or numbers";
    
    
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

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (!passwordReg.test(input.password)) {
      newErrors.password = "Password does not meet requirements";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Clear error for specific field when user types
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setLoading(true)
    try {
      const res = await axios.post(`${TRANSPORTER_API_END_POINT}/register`, input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )
      if (res.data.success) {
        toast.success("Registration successful! Welcome to the fleet.");
        navigate("/transporter/login")
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50 -skew-x-12 translate-x-20 hidden lg:block" />

      <button onClick={() => navigate("/")} className="absolute top-6 left-6 flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors font-semibold z-20 group">
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={20} /> 
        </div>
        <span>Back</span>
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 overflow-hidden relative z-10 border border-emerald-100">
        
        {/* Branding Side */}
        <div className="lg:col-span-4 bg-emerald-600 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Truck size={28} />
            </div>
            <h2 className="text-3xl font-bold leading-tight">Join the Fleet.</h2>
            <p className="text-emerald-100 mt-4 text-sm leading-relaxed">
              Start providing transportation services to farmers and sellers across the region with E-Haat.
            </p>
          </div>
          <div className="hidden lg:block">
            <img src="/Etruck1.png" alt="Logistics" className="w-full object-contain brightness-110 drop-shadow-lg" />
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-8 p-8 md:p-12">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Partner Registration
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-3">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Please fill in your details to get started.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={input.name}
                    placeholder="e.g., Kamal Khanal"
                    onChange={changeEventHandler}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm ${errors.name ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={input.email}
                    placeholder="khanal234@example.com"
                    onChange={changeEventHandler}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm ${errors.email ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phone"
                    value={input.phone}
                    placeholder="98XXXXXXXX"
                    onChange={changeEventHandler}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={input.password}
                    placeholder="••••••••"
                    onChange={changeEventHandler}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm ${errors.password ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Password Hint */}
            <div className={`bg-green-50 border rounded-xl p-3 text-sm transition-all ${errors.password ? 'border-red-200 bg-red-50' : 'border-green-200'}`}>
              <p className={`text-[10px] font-bold uppercase mb-1 ${errors.password ? 'text-red-600' : 'text-green-700'}`}>Security Hint:</p>
              <ul className={`list-disc list-inside text-[11px] space-y-1 ${errors.password ? 'text-red-500' : 'text-green-600'}`}>
                <li>Min. 8 characters with Uppercase, Number, & Special Char.</li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Transporter Account"
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already a partner?{' '}
              <button
                type="button"
                onClick={() => navigate("/transporter/login")}
                className="font-bold text-emerald-600 hover:underline"
              >
                Log In here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransporterRegister