import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin,
  Star, Package, ShieldCheck,
  ShieldAlert, Check, X, ArrowLeft,
  Calendar, Fingerprint, Globe
} from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ADMIN_API_END_POINT } from "@/utils/constants";
import useGetVerifyUser from "@/hooks/adminHooks/useGetVerifyUser";

const ViewSellerCompletly = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const verifyUser = useGetVerifyUser();

  const handleVerification = async (id, role, action) => {
    await verifyUser(id, role, action);
    setSeller((prev) => ({
      ...prev,
      verificationStatus: action,
      isVerified: action === "approved",
    }));
  };

  const fetchSellerDetails = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/seller/${id}`, { withCredentials: true });
      if (res.data.success) {
        setSeller(res.data.seller);
      }
    } catch (error) {
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-gray-400">
        <User size={64} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">Seller not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-400 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-start gap-5">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 p-2.5 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Seller Verification</h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Fingerprint size={14} /> Account ID: {seller._id}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {seller.verificationStatus === "approved" ? (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold shadow-lg shadow-emerald-900/10">
                <ShieldCheck size={20} /> Verified Seller
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerification(id, "seller", "approved")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all"
                >
                  <Check size={18} /> Approve Seller
                </button>
                <button
                  onClick={() => handleVerification(id, "seller", "rejected")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1e1e1e] border border-red-500/30 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <img
                    src={seller.profileImage?.url || 'https://via.placeholder.com/150'}
                    alt={seller.name}
                    className="relative w-32 h-32 rounded-2xl object-cover border border-gray-700"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white text-center">{seller.name}</h3>
                <span className="mt-2 px-3 py-1 bg-gray-800 text-indigo-400 text-xs font-mono rounded-full border border-gray-700">
                  SELLER_{seller._id?.toString().slice(-6).toUpperCase()}
                </span>

                <div className="w-full mt-8 pt-8 border-t border-gray-800 space-y-5">
                  <InfoRow icon={<Mail size={18}/>} label="Email" value={seller.email} />
                  <InfoRow icon={<Phone size={18}/>} label="Phone" value={seller.phone} />
                  <InfoRow icon={<MapPin size={18}/>} label="Origin" value={seller.location?.city || 'Not Specified'} />
                </div>
              </div>
            </div>

            {/* Coordinates Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-2xl p-6 border border-indigo-500/20 shadow-xl">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-black mb-4 flex items-center gap-2">
                <Globe size={14} /> Geo-Location Node
              </h4>
              <div className="flex justify-between items-end">
                <div className="space-y-1 font-mono">
                  <p className="text-xl text-white">{seller.location?.coordinates[1]?.toFixed(6)}° N</p>
                  <p className="text-xl text-white">{seller.location?.coordinates[0]?.toFixed(6)}° E</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <MapPin size={24} className="text-indigo-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Logs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                label="Reputation" 
                value={seller.rating} 
                icon={<Star size={20} className="text-amber-400 fill-amber-400/20" />}
                subtext={`From ${seller.totalRatings} user reviews`}
              />
              <StatCard 
                label="Inventory" 
                value={seller.productsOwned?.length || 0} 
                icon={<Package size={20} className="text-indigo-400" />}
                subtext="Total active listings"
              />
              <StatCard 
                label="System Status" 
                value={seller.isBlocked ? 'Blocked' : 'Active'} 
                colorClass={seller.isBlocked ? 'text-red-400' : 'text-emerald-400'}
                subtext="Current visibility"
              />
            </div>

            {/* Verification Details */}
            <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-gray-800 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-indigo-400" /> Compliance & Audit Trail
              </h3>
              
              <div className="grid gap-4">
                <LogItem 
                  label="Verification Status" 
                  content={seller.verificationStatus} 
                  highlight 
                />
                <LogItem 
                  label="Verification Date" 
                  content={seller.verifiedAt ? new Date(seller.verifiedAt).toLocaleString() : 'Pending Processing'} 
                  icon={<ShieldAlert size={14}/>}
                />
                <LogItem 
                  label="Initial Registration" 
                  content={new Date(seller.createdAt).toLocaleString()} 
                  icon={<Calendar size={14}/>}
                />
              </div>
              
              {/* Subtle Decorative Icon */}
              <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-white/[0.02] -rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="text-indigo-400 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider leading-none mb-1">{label}</span>
      <span className="text-sm text-gray-200 truncate max-w-[180px]">{value}</span>
    </div>
  </div>
);

const StatCard = ({ label, value, icon, subtext, colorClass = "text-white" }) => (
  <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 shadow-sm">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-center gap-3">
      <span className={`text-3xl font-black ${colorClass}`}>{value}</span>
      {icon}
    </div>
    <p className="text-[10px] text-gray-600 mt-2 font-medium">{subtext}</p>
  </div>
);

const LogItem = ({ label, content, highlight, icon }) => (
  <div className="flex justify-between items-center p-4 bg-[#121212] rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-colors">
    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
      {icon} {label}
    </div>
    <span className={`text-sm font-mono ${highlight ? 'text-indigo-400 font-bold capitalize' : 'text-gray-300'}`}>
      {content}
    </span>
  </div>
);

export default ViewSellerCompletly;