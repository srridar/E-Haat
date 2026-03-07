import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { toast } from "react-toastify";
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Mail, ChevronRight, Loader2 } from "lucide-react"; // Added Loader2
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/authSlice";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/enter-admin`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
      
        dispatch(loginSuccess({ 
          user: res.data.admin, 
          token: res.data.token 
        }));
        
        toast.success(res.data.message || "Welcome back, Admin!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      dispatch(loginFailure(errorMsg));
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate("/")}
          className="group mb-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Return to Website
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
               <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your credentials to access the E-Haat management suite.
            </p>
          </div>

          <form onSubmit={submitHandler} className="p-8 pt-4 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  placeholder="admin@ehaat.com"
                  onChange={changeEventHandler}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </Label>
                <button type="button" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  placeholder="••••••••"
                  onChange={changeEventHandler}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-6">
              Protected by enterprise-grade encryption.
            </p>
          </form>
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-500">
          Not an admin? <button onClick={() => navigate('/login')} className="font-bold text-indigo-600 hover:underline">Seller Login</button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;