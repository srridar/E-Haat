import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { toast } from "sonner";
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Mail, ChevronRight, Loader2 } from "lucide-react"; // Added Loader2
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/authSlice";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const validateForm = () => {
    let newErrors = {};
    const emailReg = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    // const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!input.email.trim() || !emailReg.test(input.email)) {
      newErrors.email = "Valid email required";
    }

    // if (!input.password || !passwordReg.test(input.password)) {
    //   newErrors.password = "Strong password required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix form errors");
      return;
    }

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
    <div className=" min-h-screen flex items-center justify-center bg-[#010101] p-4 relative overflow-hidden">
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest z-50"
      >
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl group-hover:border-indigo-500 group-hover:bg-slate-800 transition-all shadow-lg shadow-black/20">
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </div>
        <span className="hidden sm:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
          Return to Portal
        </span>
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20" />

      <div className="w-full max-w-md relative z-10">


        <div className="bg-gray-900 rounded-3xl overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 ">
              <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-sm text-gray-400 mt-2">
              Enter your credentials to access the E-Haat management suite.
            </p>
          </div>

          <form onSubmit={submitHandler} className="p-8 pt-4 space-y-6 bg-slate-900">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  placeholder="admin@ehaat.com"
                  onChange={changeEventHandler}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm text-white placeholder:text-slate-600"
                />
                <p className='text-red-400 my-2'>{errors.email}</p>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-tighter"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  placeholder="••••••••"
                  onChange={changeEventHandler}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm text-white placeholder:text-slate-600"
                />
                <p className='text-red-400 my-2'>{errors.password}</p>
              </div>
            </div>

       
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-950/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="tracking-wide">Verifying Identity...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Sign In to Dashboard</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="h-[1px] w-4 bg-slate-800" />
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Enterprise Encryption Active
              </p>
              <div className="h-[1px] w-4 bg-slate-800" />
            </div>
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