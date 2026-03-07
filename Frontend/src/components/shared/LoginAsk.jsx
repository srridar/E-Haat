import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Store, Truck, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

const LoginAsk = () => {
  const navigate = useNavigate();

  return (
    <section className=" bg-[#f8fafc] flex items-center justify-center p-2 relative overflow-hidden">
      
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium group z-20"
      >
        <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span>Back</span>
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden relative z-10 border border-slate-100">
        
        {/* Left Side: Visual Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-orange-500 p-8 text-white relative">
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome Back</h2>
            <p className="text-orange-100 text-lg font-medium max-w-xs mx-auto leading-relaxed">
              Log in to your specialized dashboard and manage your E-Haat experience.
            </p>
          </div>
         
          <img
            src="/crop1.png"
            alt="Agriculture"
            className="w-[20rem] object-contain mt-4 drop-shadow-2xl "
          />
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mt-4 tracking-tight">Who's logging in?</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Please select your account type to continue.</p>
          </div>

          <div className="space-y-4">
            {/* Buyer Login */}
            <button
              onClick={() => navigate("/buyer/login")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/40 transition-all text-left"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Buyer</p>
                <p className="text-xs text-slate-500 font-medium">Browse and purchase farm-fresh goods.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Seller Login */}
            <button
              onClick={() => navigate("/seller/login")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100/40 transition-all text-left"
            >
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Store size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Seller</p>
                <p className="text-xs text-slate-500 font-medium">Manage products, orders, and shop settings.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Transporter Login */}
            <button
              onClick={() => navigate("/transporter/login")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/40 transition-all text-left"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Transporter</p>
                <p className="text-xs text-slate-500 font-medium">Access deliveries and route management.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register-as')} className="text-orange-600 font-bold hover:underline">Sign Up </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginAsk;