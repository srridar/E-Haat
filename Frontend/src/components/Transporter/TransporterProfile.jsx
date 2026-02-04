import React, { useEffect, useState } from "react";
import {
  User,
  IdCard,
  MapPin,
  Star,
  Settings,
  Lock,
  Trash2,
  Mail,
  LayoutDashboard,
  Phone,
} from "lucide-react";
import axios from "axios";
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";
import { useNavigate } from 'react-router-dom';

const TransporterProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${TRANSPORTER_API_END_POINT}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          // 🔴 IMPORTANT: backend must return { transporter }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
  
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-4">
          <div className="h-28 bg-gradient-to-r from-orange-400 to-amber-400" />
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-12 gap-6">

              {/* Profile Image */}
              <div className="h-28 w-28 bg-white rounded-2xl p-1 shadow-lg">
                <div className="h-full w-full rounded-xl overflow-hidden bg-slate-200">
                  {user?.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <User size={40} />
                    </div>
                  )}
                </div>
              </div>

              {/* Name + Status */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {user.name}
                  </h1>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.verificationStatus === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : user.verificationStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.verificationStatus}
                  </span>
                </div>

                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin size={16} />
                  Transport Provider • Nepal
                </p>
              </div>

              <button onClick={() => navigate("/transporter/profile/update")} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md">
                <Settings size={18} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Performance */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">
                Performance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold">{user.totalDeliveries}</p>
                  <p className="text-xs text-slate-500">Deliveries</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {user.rating}
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                  </p>
                  <p className="text-xs text-slate-500">Avg Rating</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between">
                <span className="text-sm font-medium">Availability</span>
                <span
                  className={`text-sm font-bold ${user.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {user.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">
                Service Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.serviceAreas?.length > 0 ? (
                  user.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium border"
                    >
                      {area}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No service areas added
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact + Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Contact */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Mail size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4">Vehicle Logistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Type</p>
                    <p className="font-semibold">{user?.vehicle?.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Capacity</p>
                    <p className="font-semibold">
                      {user?.vehicle?.capacityKg} KG
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Plate</p>
                    <p className="font-semibold">
                      {user?.vehicle?.numberPlate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Rate / KM</p>
                    <p className="font-semibold text-emerald-600">
                      Rs. {user.pricePerKm}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-slate-100 p-6 rounded-2xl border border-dashed">
              <h3 className="text-sm font-semibold uppercase mb-4">
                Security & Account
              </h3>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => navigate("/transporter/kyc-form")} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border">
                  <IdCard size={16} /> Fill KYC
                </button>
                <button onClick={()=>navigate("/transporter/password-change")} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border">
                  <Lock size={16} /> Change Password
                </button>
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border text-red-600">
                  <Trash2 size={16} /> Deactivate Account
                </button>
              </div>
            </div>
            <div className="bg-orange-400 p-2 rounded-2xl border border-dashed flex items-center justify-center">
              <button onClick={()=>navigate('/transporter/dashboard')} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 
                   text-slate-700 hover:bg-slate-50 hover:border-slate-300 
                   transition shadow-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfile;
