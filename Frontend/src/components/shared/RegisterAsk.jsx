import React from "react";
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Store, Truck, ChevronRight } from "lucide-react";

const RegisterAsk = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-emerald-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60" />

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium group"
      >
        <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span>Back</span>
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden relative z-10 border border-slate-100">
        <div className="hidden lg:flex flex-col items-center justify-center bg-emerald-600 p-6 text-white relative">
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-black mb-4">E-Haat</h2>
            <p className="text-emerald-100 text-lg font-medium max-w-xs mx-auto">
              The digital heartbeat of local agriculture and trade.
            </p>
          </div>
          <img
            src="/crop1.png"
            alt="Agriculture"
            className=" w-[20rem] object-contain mt-4 drop-shadow-2xl animate-float"
          />
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Get Started</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Select your role to join our growing community.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/buyer/sign-in")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/50 transition-all text-left" >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Buyer</p>
                <p className="text-xs text-slate-500 font-medium">Shop for fresh products from local sellers.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Seller Option */}
            <button
              onClick={() => navigate("/seller/sign-in")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100/50 transition-all text-left"
            >
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Store size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Seller</p>
                <p className="text-xs text-slate-500 font-medium">List your products and manage your store.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Transporter Option */}
            <button
              onClick={() => navigate("/transporter/sign-in")}
              className="group w-full flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/50 transition-all text-left"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">Transporter</p>
                <p className="text-xs text-slate-500 font-medium">Handle deliveries and earn with your vehicle.</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login-as')} 
                className="text-emerald-600 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterAsk;