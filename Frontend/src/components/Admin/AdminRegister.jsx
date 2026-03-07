import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShieldCheck, UserPlus, Mail, Phone, Lock, ChevronRight } from "lucide-react";

const AdminRegister = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  const validateForm = () => {
    let newErrors = {};
    const emailReg = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
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


  const submitHandler = async (e) => {
    e.preventDefault();
    validateForm();
    setLoading(true);
    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/create-admin`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (res.data.success) navigate("/admin/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-green-700 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* Left Sidebar: Context/Branding */}
        <div className="md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold leading-tight">Admin <br />Gateway</h1>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Create a new administrative identity to manage the E-Haat ecosystem, oversee transactions, and support users.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-widest font-bold">
              <div className="h-px w-8 bg-slate-700"></div>
              System Requirements
            </div>
            <p className="text-[11px] text-slate-500 italic">
              All administrative actions are logged and encrypted for security auditing.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Registration</h2>
            <p className="text-slate-500 text-sm mt-1">Please provide accurate personal credentials.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="name"
                    placeholder="John Doe"
                    onChange={changeEventHandler}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all text-sm"
                    required
                  />
                  <p className='text-red-400 my-2'>{errors.name}</p>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@e-haat.com"
                    onChange={changeEventHandler}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all text-sm"
                    required
                  />
                  <p className='text-red-400 my-2'>{errors.email}</p>
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="phone"
                    placeholder="+977-98XXXXXXXX"
                    onChange={changeEventHandler}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all text-sm"
                    required
                  />
                  <p className='text-red-400 my-2'>{errors.phone}</p>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={changeEventHandler}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all text-sm"
                    required
                  />
                  <p className='text-red-400 my-2'>{errors.password}</p>
                </div>
              </div>
            </div>

            {/* Password Validation UI */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Security Requirements</h4>
              <div className="grid grid-cols-2 gap-y-2">
                {['8+ characters', '1 Uppercase', '1 Number', '1 Special Character'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Establishing Account..." : "Complete Registration"}
                <ChevronRight size={18} />
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;