import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User, MapPin, Star,Settings,Lock,Bell,Mail,LayoutDashboard,Phone,
  ArrowLeft,Truck,LogOut,ShieldCheck, CheckCircle2,ChevronRight, MessagesSquare} from "lucide-react";

import { TRANSPORTER_API_END_POINT } from "@/utils/constants";
import useLogOut from '@/hooks/sharedHooks/useLogOut.js';


const TransporterProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = useLogOut("transporter");
  const navigate = useNavigate();

  const role ="superadmin";
  const id="69814a039ab20f77e7b72fc3";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${TRANSPORTER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.transporter);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">Initializing Session...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">

      <aside className="w-full lg:w-60 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 lg:h-screen lg:sticky lg:top-0">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-orange-600 p-2 rounded-xl text-white">
            <Truck size={24} />
          </div>
          <span className="font-black text-xl text-slate-800 tracking-tight">E-HaaT Logistics</span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Main Navigation</p>
          <NavButton onClick={() => navigate('/transporter/dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavButton onClick={() => navigate("/transporter/location-selection")} icon={<MapPin size={18} />} label="Base Location" />
          <NavButton onClick={() => navigate("/transporter/profile/update")} icon={<Settings size={18} />} label="Account Settings" active />
          <NavButton onClick={() => navigate("/transporter/notifications")} icon={<Bell size={18} />} label="Notifications" badge="3" />
          <NavButton onClick={() => navigate("/message/chat" )} icon={<MessagesSquare size={19} />} label="Messages" active />
          <NavButton onClick={() => navigate(`/message/send/${role}/${id}`)} icon={<MessagesSquare size={19} /> } label="Message Admin"  />

          <div className="h-px bg-slate-100 my-4" />

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Compliance</p>
          <NavButton onClick={() => navigate("/transporter/kyc-form")} icon={<ShieldCheck size={18} />} label="Verification/KYC" />
          <NavButton onClick={() => navigate("/transporter/password-change")} icon={<Lock size={18} />} label="Security" />
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button onClick={() => logout()}  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
            <div className="flex items-center gap-3"><LogOut size={18} /> Logout</div>
          </button>
        </div>
      </aside>


      <main className="flex-1 p-4  ">
        <div className="max-w-5xl  space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/")} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium">
              <ArrowLeft size={18} /> Back to Marketplace
            </button>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${user.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${user?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {user?.isAvailable ? 'Active Online' : 'Currently Offline'}
            </div>
          </div>


          <section className=" rounded-[2.5rem] p-2 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="h-28 w-28 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                {user?.profileImage?.url? (
                  <img src={user?.profileImage?.url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300"><User size={40} /></div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white text-white p-1.5 rounded-full">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 ">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest border border-orange-200">
                  {user?.verificationStatus}
                </span>
              </div>
            </div>

          </section>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Efficiency Profile</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Rating</span>
                    <span className="font-black text-lg flex items-center gap-1">{user?.rating} <Star size={16} className="fill-amber-400 text-amber-400" /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Completed Jobs</span>
                    <span className="font-black text-lg">{user?.totalDeliveries}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-orange-500 w-[85%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">Top 15% in region</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                <p className="text-[14px] font-bold uppercase tracking-widest text-orange-400 mb-2">Operating Base</p>
                <p className="text-slate-300 font-medium text-lg italic"> {user?.location?.address}</p>
              </div>
            </div>


            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Vehicle Logistics</h3>
                  <div className="space-y-3">
                    <DetailItem label="Vehicle Type" value={user?.vehicle?.type} />
                    <DetailItem label="Number Plate" value={user?.vehicle?.numberPlate} />
                    <DetailItem label="Payload Capacity" value={`${user?.vehicle?.capacityKg} KG`} />
                    <p className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">Pricing Tier</p>
                    <p className="text-3xl font-black text-orange-500">Rs. {user?.pricePerKm}</p>
                    <p className="text-xs text-slate-400 font-medium">Standard rate per Kilometer</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Contact Details</h3>
                  <div className="space-y-4">
                    <DetailItem label="Business Phone" value={user?.phone} icon={<Phone size={14} />} />
                    <DetailItem label="Public Email" value={user?.email} icon={<Mail size={14} />} />
                    <div className="pt-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Active Service Zones</p>
                      <div className="flex flex-wrap gap-2">
                        {user?.serviceAreas?.map(area => (
                          <span key={area} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">{area}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="p-6 bg-red-50/50 rounded-[2rem] border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-red-800">Account Safety</p>
                  <p className="text-xs text-red-600/70 font-medium leading-relaxed">Deactivating your account will hide your profile from all active buyers.</p>
                </div>
                <button className="px-4 py-2 bg-white text-red-600 text-xs font-bold rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                  Deactivate Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};


const NavButton = ({ icon, label, onClick, active = false, badge = null }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${active ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
  >
    <div className="flex items-center gap-3">
      <span className={`${active ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge ? (
      <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">{badge}</span>
    ) : (
      <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
    )}
  </button>
);

const DetailItem = ({ label, value, icon }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
    <div className="flex items-center gap-2 font-bold text-slate-700">
      {icon && <span className="text-slate-300">{icon}</span>}
      {value || "Not provided"}
    </div>
  </div>
);

export default TransporterProfile;