import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BUYER_API_END_POINT } from '@/utils/constants';
import axios from "axios";
import { ArrowLeft, Mail, Lock, ShoppingBag, AlertCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/authSlice";

const BuyerLogin = () => {
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
      const res = await axios.post(`${BUYER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (res.data.success) {
        // Make sure you pick buyer object, not seller
        dispatch(loginSuccess({ user: res.data.buyer }));
        navigate("/buyer/profile");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid email or password");
      dispatch(loginFailure(error.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fee7] relative overflow-hidden px-4">

      {/* Visual Background Accent */}
      <div className="absolute top-0 right-0 w-full h-40 bg-orange-500 -skew-y-3 origin-top-right shadow-lg" />

      {/* Navigation */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-emerald-700 transition-colors font-bold"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-emerald-50">


        <div className="hidden lg:flex flex-col items-center justify-center bg-emerald-50 p-12 relative">
          <div className="absolute bottom-10 right-10 text-emerald-200 opacity-40">
            <ShoppingBag size={150} />
          </div>
          <img
            src="/crop1.png"
            alt="Fresh Produce"
            className="w-full max-w-xs object-contain drop-shadow-2xl z-10"
          />
          <div className="mt-8 text-center z-10">
            <h3 className="text-2xl font-black text-emerald-900">E-Haat Marketplace</h3>
            <p className="text-emerald-600 font-medium mt-2 italic">Bringing the farm to your doorstep.</p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Buyer Login</h2>
            <p className="text-slate-500 mt-2 font-medium">Shop fresh. Eat local. Welcome back!</p>
          </div>

          {/* Alert Area */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{apiError}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Account</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                <input
                  name="email"
                  type="text"
                  value={input.email}
                  placeholder="hello@buyer.com"
                  onChange={changeEventHandler}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all font-medium text-sm
                    ${errors.email
                      ? 'border-red-200 bg-red-50 focus:border-red-500'
                      : 'border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot Code?</button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                <input
                  name="password"
                  type="text"
                  value={input.password}
                  placeholder="••••••••"
                  onChange={changeEventHandler}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all font-medium text-sm
                    ${errors.password
                      ? 'border-red-200 bg-red-50 focus:border-red-500'
                      : 'border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50'}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Entering E-Haat...
                </>
              ) : (
                "Log In to Shop"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            First time here?{' '}
            <button
              onClick={() => navigate('/buyer/register')}
              className="font-black text-emerald-600 hover:underline transition-all"
            >
              Join the Community
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BuyerLogin;