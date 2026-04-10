import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BUYER_API_END_POINT } from '@/utils/constants';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { role } = useParams(); // Destructured for cleaner access
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BUYER_API_END_POINT}/forgot-password`,
        { email, role },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.status === 200) {
        setIsSubmitted(true);
        toast.success("OTP sent to your email");
        // Optional: you might want to delay navigation or let them click the link in the success state
        // navigate(`/verify-otp/${role}/${email}`); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4">
      <div className="absolute top-16 right-0 w-full h-28 opacity-85  bg-orange-500 -skew-y-12 origin-top-right shadow-lg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-500 p-3.5 rounded-2xl shadow-lg shadow-orange-200">
              <Mail className="text-white w-7 h-7" />
            </div>
          </div>

          {!isSubmitted ? (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Reset Password
                </h2>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                  Enter the email associated with your
                  <span className="font-semibold text-green-600 ml-1">E-Haat</span>
                  <span className="capitalize"> {role}</span> account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors ${email ? 'text-green-500' : 'text-gray-400 group-focus-within:text-green-500'}`} />
                    </div>
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 text-sm transition-all focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none disabled:opacity-70"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs font-medium flex items-center gap-1.5 ml-1"
                    >
                      <AlertCircle size={14} /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full ring-8 ring-green-50">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Check your mail</h3>
              <p className="mt-3 text-gray-500 text-sm">
                We've sent a recovery link to:  <br />
                <button
                  onClick={() => navigate(`/verify-otp/${role}/${email}`)}
                  className="mt-1 font-bold text-green-700 hover:text-green-800 transition-colors cursor-pointer"
                >
                  {email}
                </button>
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors"
                >
                  Didn't get the mail? <span className="underline underline-offset-4">Resend link</span>
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => navigate(`/${role}/login`)}
              className="flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;