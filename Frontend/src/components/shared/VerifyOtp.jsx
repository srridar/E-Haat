import React, { useState } from "react";
import { useNavigate , useParams} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const VerifyOtp = () => {
  const { role, email } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");
    if (otp.length !== 6) return toast.error("OTP must be 6 digits");

    try {
      setLoading(true);
      const res = await axios.post(`${BUYER_API_END_POINT}/verify-otp`, { email, otp, role }, { headers: { "Content-Type": "application/json" } } );

      if (res.data.success) {
        toast.success("OTP verified");
        navigate(`/reset-password/${role}/${email}`, { state: { email, role } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-white to-orange-100 px-4">
     
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
              <KeyRound className="text-emerald-600 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Verification
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              We've sent a 6-digit code to your email
            </p>
          </div>

          <form onSubmit={verifyOtpHandler} className="space-y-6">
            <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 py-2 px-4 rounded-full text-xs font-medium text-emerald-700">
              <Mail size={14} />
              {email || "user@example.com"}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Enter Secure Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                  placeholder="000000"
                  maxLength={6}
                  className="w-full py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-3xl font-bold tracking-[0.5em] text-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-200 placeholder:tracking-widest"
                />
              </div>
              <div className="flex justify-between px-1">
                 <span className="text-[10px] text-gray-400 font-medium">NUMERIC CODE ONLY</span>
                 <span className="text-[10px] text-gray-400 font-medium">{otp.length}/6</span>
              </div>
            </div>

  
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying Code...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>

    
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
            <button
              onClick={() => navigate("/seller/forgot-password")}
              className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
            >
              Didn't receive the code? <span className="text-emerald-600 font-bold underline underline-offset-4">Resend</span>
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Change Email Address 
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;