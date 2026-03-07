import React, { useState, useEffect } from "react";
import { 
  UserIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  CubeIcon, 
  ArrowRightOnRectangleIcon,
  XMarkIcon, 
  ChevronDownIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useLogOut from '@/hooks/sharedHooks/useLogOut.js'
import useGetProfile from '@/hooks/sharedHooks/useGetProfile'

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState(null);
  const [setting, setSetting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const logout = useLogOut("buyer");
  const getProfile = useGetProfile("buyer");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) setBuyer(profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row gap-8 p-4 md:p-8 lg:p-12">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden sticky top-8">
          {/* Sidebar Mini Profile */}
          <div className="bg-emerald-600 p-6 text-white text-center">
            <img
              src={buyer?.profileImage?.url || `https://ui-avatars.com/api/?name=${buyer?.name || 'User'}&background=10b981&color=fff`}
              alt="Profile"
              className="w-20 h-20 rounded-2xl mx-auto border-4 border-white/20 object-cover mb-3"
            />
            <h3 className="font-bold truncate">{buyer?.name}</h3>
            <p className="text-emerald-100 text-xs truncate opacity-80">{buyer?.email}</p>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <button className="flex items-center gap-3 w-full p-3 text-emerald-600 bg-emerald-50 rounded-xl font-bold transition-all">
              <UserIcon className="h-5 w-5" />
              <span className="text-sm">My Profile</span>
            </button>
            <button 
              onClick={() => navigate("/buyer/all-orders")}
              className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
            >
              <CubeIcon className="h-5 w-5" />
              <span className="text-sm">My Orders</span>
            </button>
              <button 
              onClick={() => navigate("/buyer/all-request")}
              className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
            >
              <CubeIcon className="h-5 w-5" />
              <span className="text-sm">My Requests</span>
            </button>
            <button 
              onClick={() => navigate("/buyer/notifications")}
              className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
            >
              <BellIcon className="h-5 w-5" />
              <span className="text-sm">Notifications</span>
            </button>
            <button 
              onClick={() => navigate("/message/chat")}
              className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
            >
              <BellIcon className="h-5 w-5" />
              <span className="text-sm">Messages</span>
            </button>
            <button 
              onClick={() => setSetting(true)}
              className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="text-sm">Settings</span>
            </button>
            
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="text-sm">Log out</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        
        {/* Profile Banner Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50" />
          
          <img
            src={buyer?.profileImage?.url || `https://ui-avatars.com/api/?name=${buyer?.name || 'User'}&background=10b981&color=fff`}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-emerald-50 relative z-10 shadow-lg"
          />

          <div className="flex-1 text-center md:text-left z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Verified Buyer</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">{buyer?.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><EnvelopeIcon className="h-4 w-4" /> {buyer?.email}</span>
              <span className="flex items-center gap-1.5"><MapPinIcon className="h-4 w-4" /> {buyer?.location?.city || "City not set"}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/buyer/profile/update")}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xl shadow-slate-200 font-bold z-10"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Profile
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contact Details Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-emerald-600" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Phone</p>
                <p className="text-slate-900 font-bold">{buyer?.phone || "N/A"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Email</p>
                <p className="text-slate-900 font-bold">{buyer?.email}</p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-emerald-600" />
              Delivery Zone
            </h3>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Current City</p>
              <p className="text-emerald-900 font-bold text-xl">{buyer?.location?.city || "Not Set"}</p>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              This is your primary delivery zone for fresh produce orders. Update this in settings to find sellers near you.
            </p>
          </div>
        </div>

        {/* Danger Zone / Secondary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => navigate("/buyer/change-password")}
            className="flex-1 px-6 py-4 border-2 border-emerald-100 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-all text-sm"
          >
            Update Security Password
          </button>
          <button className="flex-1 px-6 py-4 border-2 border-red-50 text-red-400 rounded-2xl font-bold hover:bg-red-50 transition-all text-sm">
            Request Account Deletion
          </button>
        </div>
      </main>

      {/* Settings Modal */}
      {setting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">App Settings</h2>
              <button onClick={() => setSetting(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <XMarkIcon className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700">Display Theme</span>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm cursor-pointer">
                  <span>Light Mode</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700">Interface Language</span>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm cursor-pointer">
                  <span>English (US)</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSetting(false)}
              className="w-full mt-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 transition-transform active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default BuyerProfile;