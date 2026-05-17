import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ADMIN_API_END_POINT } from '@/utils/constants';

const AdminPasswordChange = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateInput = ({ oldPassword, newPassword, confirmPassword }) => {
    const errors = {};
    const strongPassRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!oldPassword.trim()) errors.oldPassword = "Current password is required";
    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (oldPassword === newPassword) {
      errors.newPassword = "Must be different from old password";
    } else if (!strongPassRegex.test(newPassword)) {
      errors.newPassword = "Weak password complexity";
    }
    if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    const validationErrors = validateInput(passwords);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const request = axios.post(
        `${ADMIN_API_END_POINT}/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true }
      );

      toast.promise(request, {
        loading: "Changing admin password...",
        success: "Password changed successfully!",
        error: (err) =>
          err?.response?.data?.message || "Failed to change password",
      });

      const res = await request;

      if (res.data.success) {
        await axios.post(
          `${ADMIN_API_END_POINT}/logout`,
          {},
          { withCredentials: true }
        );

        navigate("/admin/login");
      }

    } catch (error) {
      console.error("Admin password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-200">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-medium"
        >
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 group-hover:border-indigo-500 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden border border-slate-800 relative z-10">

        {/* Left Side: Branding/Status */}
        <div className="bg-slate-950/50 p-12 flex flex-col justify-center items-center text-center border-r border-slate-800">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-10 animate-pulse" />
            <div className="relative bg-slate-900 p-8 rounded-full border border-slate-800 shadow-inner">
              <Lock className="w-16 h-16 text-orange-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Security Center</h1>
          <p className="mt-4 text-slate-400 max-w-[250px] leading-relaxed">
            Manage your administrative credentials and protect your account integrity.
          </p>

          <div className="mt-12 w-full">
            <div className="flex items-center gap-3 text-left bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="text-emerald-500 shrink-0" />
              <p className="text-xs text-slate-300 font-medium">End-to-end encryption active.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 bg-slate-900">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Change Password</h2>
            <p className="text-slate-400 text-sm mt-1">Please update your keys regularly.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {[
              { label: "Current Password", name: "oldPassword", type: "password", placeholder: "••••••••" },
              { label: "New Password", name: "newPassword", type: showPassword ? "text" : "password", placeholder: "New Secret Key" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Repeat Secret Key" }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={passwords[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-950 border ${errors[field.name] ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-700'
                      } rounded-xl px-5 py-3.5 outline-none focus:border-orange-500 transition-all text-white placeholder:text-slate-600`}
                  />
                  {field.name === "newPassword" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                {errors[field.name] && (
                  <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-400">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">{errors[field.name]}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Password Rules */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 px-1">
              {['8+ Chars', 'Uppercase', 'Number', 'Symbol'].map((rule) => (
                <div key={rule} className="flex items-center gap-2 text-[10px] uppercase tracking-tighter font-bold text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  {rule}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Update Credentials"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-slate-500 py-2 text-sm font-semibold hover:text-slate-300 transition-colors"
              >
                Cancel Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordChange;