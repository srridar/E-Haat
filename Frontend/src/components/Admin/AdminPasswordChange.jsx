import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import useChangePassword from "@/hooks/sharedHooks/useChangePassword";

const AdminPasswordChange = () => {
  const navigate = useNavigate();
  const changePassword = useChangePassword("admin");

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
      await changePassword(passwords.oldPassword, passwords.newPassword);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-4xl mb-3">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all font-medium"
        >
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-orange-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 relative z-10">
        
        <div className="bg-slate-900 p-12 text-white flex flex-col justify-center items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-slate-800 p-8 rounded-full border border-slate-700">
               <Lock className="w-16 h-16 text-orange-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
          <p className="mt-4 text-slate-400 max-w-[250px] leading-relaxed">
            Manage your administrative credentials and protect your account integrity.
          </p>
          
          <div className="mt-12 w-full space-y-4">
            <div className="flex items-center gap-3 text-left bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <ShieldCheck className="text-green-500 shrink-0" />
              <p className="text-xs text-slate-300">Encryption-grade security protocols active.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
            <p className="text-slate-500 text-sm mt-1">Please update your keys regularly.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Field Wrapper Component would go here */}
            {[
              { label: "Current Password", name: "oldPassword", type: "password", placeholder: "••••••••" },
              { label: "New Password", name: "newPassword", type: showPassword ? "text" : "password", placeholder: "New Secret Key" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Repeat Secret Key" }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-50 border ${errors[field.name] ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'} rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder:text-slate-400`}
                  />
                  {field.name === "newPassword" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
                {errors[field.name] && (
                  <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">{errors[field.name]}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Complexity Indicator */}
            <div className="grid grid-cols-2 gap-2 mt-2">
               {['8+ Chars', 'Uppercase', 'Number', 'Symbol'].map((rule) => (
                 <div key={rule} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                   {rule}
                 </div>
               ))}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Processing..." : "Secure My Account"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-slate-500 py-2 text-sm font-semibold hover:text-slate-800 transition-colors"
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