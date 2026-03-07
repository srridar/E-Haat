import React, { useEffect, useState } from "react";
import useGetProfile from "@/hooks/adminHooks/useGetProfile";
import { ArrowLeft, Mail, Phone, Calendar, ShieldCheck, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const getProfile = useGetProfile();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (!data) {
          setError("Unable to load profile");
          return;
        }
        setAdmin(data);
      } catch (err) {
        setError("Something went wrong : " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getProfile]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-6 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-red-700 underline">Go Back</button>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="max-w-5xl mx-auto pb-10 pt-4">

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <div className="p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Cover Section */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 mb-8">
            <img
              src={ admin.profileImage?.url || `https://ui-avatars.com/api/?name=${admin?.name || 'User'}&background=10b981&color=fff`}
              alt="Admin Profile"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="flex-1 pb-2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">{admin.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                  {admin.role}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                  <Mail size={14} /> {admin.email}
                </span>
              </div>
            </div>
            <button onClick={() => navigate("/admin/admin-profile-update")} className="mb-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Contact Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <ProfileItem icon={<Phone size={18} />} label="Phone Number" value={admin.phone || "Not provided"} />
                  <ProfileItem icon={<ShieldCheck size={18} />} label="Email Verified" value={admin.emailVerified ? "Verified" : "Pending"} isStatus />
                  <ProfileItem icon={<Activity size={18} />} label="Account Status" value={admin.isActive ? "Active" : "Inactive"} isStatus />
                  <ProfileItem icon={<Calendar size={18} />} label="Member Since" value={new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
                  <ProfileItem icon={<Calendar size={18} />} label="Last Active" value={admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "First session"} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Permissions & Access</h3>
                <div className="flex flex-wrap gap-2">
                  {admin.permissions?.length ? (
                    admin.permissions.map((perm, index) => (
                      <span key={index} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {perm}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">Standard admin access granted.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Mini Stats/Info */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="font-bold text-gray-800 mb-4">Account Security</h4>
              <p className="text-xs text-gray-500 mb-6">Your account is currently active and protected by system-level permissions.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <span className="text-sm text-gray-600">2FA Status</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">OFF</span>
                </div>
                <button onClick={()=>navigate("/admin/password-change")} className="w-full py-2.5 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Field Component */
const ProfileItem = ({ label, value, icon, isStatus }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase leading-none mb-1">{label}</p>
      <p className={`font-semibold ${isStatus && value === "Active" || value === "Verified" ? "text-emerald-600" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default AdminProfile;