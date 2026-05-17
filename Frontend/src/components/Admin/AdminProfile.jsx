import React from "react";
import useGetProfile from "@/hooks/adminHooks/useGetProfile";
import { 
  ArrowLeft, Mail, Phone, Calendar, 
  ShieldCheck, Activity, Loader2, Edit3, 
  Key, ShieldAlert, Cpu
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { admin, loading, error } = useGetProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-[#0A0A0A]">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Decrypting Profile Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-500/5 rounded-[2rem] border border-red-500/20 shadow-2xl shadow-red-500/5">
        <ShieldAlert size={40} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-400 font-bold uppercase tracking-tight">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-6 text-xs font-black text-white bg-red-500/20 px-6 py-2 rounded-xl hover:bg-red-500/40 transition-all uppercase tracking-widest"
        >
          Return to Base
        </button>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 pb-12 pt-6">
      <div className="max-w-5xl mx-auto px-4">
      
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-gray-500 hover:text-indigo-400 transition-all font-black text-[11px] uppercase tracking-[0.2em]"
          >
            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 border border-white/5 group-hover:border-indigo-500/30 transition-all">
              <ArrowLeft size={18} />
            </div>
            System Dashboard
          </button>
        </div>

        <div className="bg-[#111111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl shadow-black">
          <div className="h-40 bg-gradient-to-br from-indigo-900 via-purple-900 to-[#111111] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#111111] to-transparent" />
          </div>

          <div className="px-8 pb-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8 -mt-16 mb-12">
              <div className="relative group">
                <img
                  src={admin.profileImage?.url || `https://ui-avatars.com/api/?name=${admin?.name || 'User'}&background=6366f1&color=fff`}
                  alt="Admin Profile"
                  className="w-40 h-40 rounded-[2rem] object-cover border-[6px] border-[#111111] shadow-2xl bg-[#1A1A1A] group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none" />
              </div>

              <div className="flex-1 pb-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{admin.name}</h2>
                  <span className="w-fit mx-auto md:mx-0 px-4 py-1 text-[10px] font-black rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-[0.2em]">
                    {admin.role}
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-5">
                  <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Mail size={14} className="text-indigo-500" /> {admin.email}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-tighter">
                    <Cpu size={14} className="opacity-40" /> ID: {admin._id?.slice(-10)}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/admin/admin-profile-update")} 
                className="mb-2 flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95"
              >
                <Edit3 size={14} /> Update Credentials
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Side: Account Specs */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Core Parameters</h3>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ProfileItem icon={<Phone size={18} />} label="Signal Contact" value={admin.phone || "No Link Established"} />
                    <ProfileItem icon={<ShieldCheck size={18} />} label="Auth Status" value={admin.emailVerified ? "Verified" : "Unsecured"} isStatus />
                    <ProfileItem icon={<Activity size={18} />} label="Operational" value={admin.isActive ? "Online" : "Offline"} isStatus />
                    <ProfileItem icon={<Calendar size={18} />} label="Enlisted Since" value={new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
                  </div>
                </div>

             
              </div>

         
              <div className="space-y-6">
                <div className="bg-[#161616] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                  <h4 className="font-black text-white text-xs uppercase tracking-widest mb-2">Protocol Security</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-8">
                    Account encryption active. System-level permissions are monitored.
                  </p>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2FA Uplink</span>
                      <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">DISABLED</span>
                    </div>
                    
                    <button 
                      onClick={() => navigate("/admin/password-change")} 
                      className="group/btn w-full py-4 flex items-center justify-center gap-3 text-[11px] font-black text-indigo-400 border border-indigo-500/20 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all uppercase tracking-[0.2em]"
                    >
                      <Key size={14} className="group-hover/btn:rotate-12 transition-transform" /> 
                      Rotate Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};


const ProfileItem = ({ label, value, icon, isStatus }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
    <div className="mt-1 text-indigo-500/70">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
      <p className={`text-sm font-bold tracking-tight ${isStatus && (value === "Online" || value === "Verified") ? "text-emerald-400" : "text-gray-200"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default AdminProfile;