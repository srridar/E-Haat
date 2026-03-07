import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TRANSPORTER_API_END_POINT } from '@/utils/constants';
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Mail, Lock, Truck, AlertCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "@/redux/authSlice";

const TransporterLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [input, setInput] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateInput = ({ email, password }) => {
    const errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailReg.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Must be at least 6 characters";
    }

    return errors;
  }

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (apiError) setApiError("");
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateInput(input);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      dispatch(loginStart());
      const res = await axios.post(`${TRANSPORTER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
       
      if (res.data.success) {
        dispatch(loginSuccess({ user: res.data.transporter }));
        toast.success("Login successful 🎉");
        navigate("/transporter/profile");
      }
    } catch (error) {
      // Handle backend error messages
      setApiError(error.response?.data?.message || "Invalid credentials or server error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" flex items-center justify-center bg-slate-50 relative  px-4">
      

      <div className="absolute top-0 left-0 w-full h-32 bg-emerald-600 -skew-y-3 origin-top-left shadow-lg" />
      
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="absolute top-4 left-6 z-20 flex items-center gap-2 text-white hover:text-emerald-100 transition-colors font-medium">
        <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden  z-10 border border-gray-100">

       
        <div className="hidden lg:flex flex-col items-center justify-center bg-emerald-200 relative p-4">
          <div className="absolute top-10 left-10 text-emerald-600 opacity-20">
             <Truck size={120} />
          </div>
          <img
            src="/truck.png" // Ensure this path is correct in your public folder
            alt="Transporter Logistics"
            className="w-full max-w-sm object-contain drop-shadow-2xl z-10 animate-pulse-slow"
          />
          <div className=" text-center z-10">
            <h3 className="text-2xl font-bold text-emerald-900">Swift Logistics</h3>
            <p className="text-emerald-600 font-medium">Powering the E-Haat Supply Chain</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Transporter Login</h2>
            <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 animate-shake">
              <AlertCircle size={20} />
              <p className="text-sm font-semibold">{apiError}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  name="email"
                  type="text"
                  value={input.email}
                  placeholder="name@company.com"
                  onChange={changeEventHandler}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none text-sm font-medium
                    ${errors.email 
                      ? 'border-red-200 bg-red-50 focus:border-red-500' 
                      : 'border-gray-100 bg-gray-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input
                  name="password"
                  type="text"
                  value={input.password}
                  placeholder="••••••••"
                  onChange={changeEventHandler}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none text-sm font-medium
                    ${errors.password 
                      ? 'border-red-200 bg-red-50 focus:border-red-500' 
                      : 'border-gray-100 bg-gray-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50'}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying Account...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            Don't have a logistics account?{' '}
            <button 
              onClick={() => navigate('/transporter/register')}
              className="font-bold text-emerald-600 hover:underline transition-all"
            >
              Join the E-haat
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransporterLogin;