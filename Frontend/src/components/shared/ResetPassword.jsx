import React, { useState, useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, Check } from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { role, email } = useParams();

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access");
      navigate(`/forgot-password/${role}`);
    }
  }, [email, navigate, role]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = input;

    if (!password || !confirmPassword) return toast.error("All fields are required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await axios.post(
        `${BUYER_API_END_POINT}/reset-password`,
        { email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("Password reset successful 🎉");
        navigate(`/${role}/login`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-white to-orange-100 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-12">

          {/* Brand Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-tr from-emerald-600 to-green-500 p-4 rounded-3xl shadow-xl shadow-emerald-200/50 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              New Password
            </h2>
            <p className="text-sm text-gray-500 mt-3 font-medium">
              Secure your <span className="text-emerald-600">E-Haat</span> account for <br />
              <span className="text-gray-700">{email}</span>
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">

            {/* New Password Input */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeHandler}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Simple Password Strength Indicator */}
              <div className="flex gap-1.5 mt-2 ml-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-full rounded-full transition-all duration-500 ${input.password.length >= step * 2 ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-gray-400">
                  <Check size={20} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={changeHandler}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-white/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-300 shadow-sm"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Updating Security...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm New Password</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Safety Note */}
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <ShieldCheck size={14} />
              End-to-end encrypted password reset
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;