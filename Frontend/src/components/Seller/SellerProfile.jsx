import React, { useState, useEffect } from "react";
import {
  UserIcon, Cog6ToothIcon, BellIcon, CubeIcon,
  ArrowRightOnRectangleIcon, MapPinIcon,
  PhoneIcon, CalendarIcon, CheckBadgeIcon,
  XMarkIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useLogOut from '@/hooks/sharedHooks/useLogOut.js';
import useGetProfile from '@/hooks/sharedHooks/useGetProfile';
import LocationPicker from '@/components/LocationPicker';

const SellerProfile = () => {
  const [seller, setSeller] = useState({});
  const [setting, setSetting] = useState(false);
  const navigate = useNavigate();
  const logout = useLogOut("seller");
  const getProfile = useGetProfile("seller");

  useEffect(() => {
    const fetchprofile = async () => {
      const profile = await getProfile();
      if (profile) setSeller(profile);
    };
    fetchprofile();
  }, []);

  const latitude = seller?.location?.coordinates?.[1];
  const longitude = seller?.location?.coordinates?.[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row gap-6 p-4 md:p-8">

      <aside className="w-full md:w-64 flex flex-col gap-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 text-center bg-gradient-to-br from-green-600 to-green-700">
            <img
              src={seller?.profileImage?.url || `https://ui-avatars.com/api/?name=${seller?.name || 'User'}&background=10b981&color=fff`}
              alt="profileimage"
              className="w-20 h-20 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
            />
            <h2 className="text-white font-bold truncate">{seller?.name}</h2>
            <p className="text-green-100 text-xs truncate">{seller?.email}</p>
          </div>

          <nav className="p-2 space-y-1">
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active />
            <NavItem icon={<CubeIcon className="w-5 h-5" />} label="My Products" onClick={() => navigate("/seller/my-products")} />
            <NavItem icon={<BellIcon className="w-5 h-5" />} label="Notifications" onClick={() => navigate("/seller/notifications")} />
            <NavItem icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" onClick={() => setSetting(true)} />
            <hr className="my-2 border-gray-100" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 space-y-6">

        {/* Header Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Account Status</span>
              <div className="flex items-center gap-2 mt-1">
                <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                <span className="font-bold text-gray-800 text-lg">{seller?.isVerified} </span>
              </div>
            </div>
            <div className="w-[1px] bg-gray-100 hidden md:block"></div>
            <div className="text-center md:text-left">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Average Rating</span>
              <div className="mt-1">
                <span className="font-bold text-gray-800 text-lg">⭐ {seller?.totalRatings}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/seller/profile/update")}
            className="w-full md:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-md shadow-green-200"
          >
            Edit Profile Details
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                Contact Details
              </h3>
              <div className="space-y-4">
                <InfoItem icon={<PhoneIcon />} label="Phone" value={seller?.phone || 'Not provided'} />
                <InfoItem icon={<MapPinIcon />} label="City" value={seller?.location?.city || 'Not set'} />
                <InfoItem icon={<CalendarIcon />} label="Joined" value={
                  seller?.createdAt
                    ? new Date(seller.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).replace(" ", " ")
                    : "N/A"
                } />
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
              <button onClick={() => navigate("/seller/change-password")} className="w-full py-2 text-sm font-medium text-green-600 border border-green-100 rounded-lg hover:bg-green-50 transition">
                Change Password
              </button>
              <button className="w-full py-2 text-sm font-medium text-red-400 hover:text-red-600 transition">
                Delete Account
              </button>
            </section>
          </div>


          <div className={`lg:col-span-2 ${setting ? "blur-sm pointer-events-none" : ""}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Business Location</h3>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                </span>
              </div>
              <div className="flex-1 relative bg-gray-50">
                {latitude && longitude ? (
                  <LocationPicker lat={latitude} lng={longitude} className="w-full h-full" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Location data unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>


      {setting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm left-15 z-100 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <button onClick={() => setSetting(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                <span className="font-medium text-gray-700">Display Theme</span>
                <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  Light <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                <span className="font-medium text-gray-700">Language</span>
                <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  English <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const NavItem = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active
        ? "bg-green-50 text-green-700 shadow-sm"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      }`}
  >
    {icon}
    {label}
  </button>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1 text-green-600 w-5 h-5">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
  </div>
);

export default SellerProfile;