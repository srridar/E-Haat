import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin,
  Star, Package, ShieldCheck,
  ShieldAlert, Check, X
} from 'lucide-react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { ADMIN_API_END_POINT } from "@/utils/constants";
import useGetVerifyUser from "@/hooks/adminHooks/useGetVerifyUser";

const ViewSellerCompletly = () => {

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const verifyUser = useGetVerifyUser();

  const handleVerification = async (id, role, action) => {
    await verifyUser(id, role, action);
    setSeller((prev) => ({
      ...prev,
      verificationStatus: action,
      isVerified: action === "approved" ? true : false,
    }));
  };

  const fetchSellerDetails = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/seller-approval/${id}`, { withCredentials: true });
      if (res.data.success) {
        setSeller(res.data.seller);
        console.log("i have come hare " + res.data.seller);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerDetails();
  }, [id]);


  if (loading) {
    return <div className="p-10 text-center">Loading product data...</div>;
  }

  if (!seller) {
    return <div className="p-10 text-center">Seller not found</div>;
  }


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      {/* Top Banner / Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Seller Verification</h2>
        <div className="flex gap-3">

          <button
            onClick={() => handleVerification(id, "seller", "approved")}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition"
          >
            <Check size={18} /> Approve Seller
          </button>
          <button
            onClick={() => handleVerification(id, "seller", "rejected")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <X size={18} /> Reject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="relative">
              <img
                src={seller.profileImage?.url || 'https://via.placeholder.com/150'}
                alt={seller.name}
                className="w-32 h-32 rounded-2xl object-cover shadow-inner shadow-black/10"
              />
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-800">{seller.name}</h3>
            <p className="text-slate-500 text-sm mb-4">Seller ID: {seller._id?.toString().slice(-6).toUpperCase()}</p>

            <div className="w-full pt-4 border-t border-slate-50 space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={18} className="text-indigo-500" />
                <span className="text-sm truncate">{seller.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={18} className="text-indigo-500" />
                <span className="text-sm">{seller.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-indigo-500" />
                <span className="text-sm">{seller.location?.city || 'Unknown City'}</span>
              </div>
            </div>
          </div>

          {/* Location Badge */}
          <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-3">Geo Coordinates</h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-mono">{seller.location?.coordinates[1]?.toFixed(4)}° N</p>
                <p className="text-lg font-mono">{seller.location?.coordinates[0]?.toFixed(4)}° E</p>
              </div>
              <MapPin size={32} className="opacity-40" />
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium">Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-800">{seller.rating}</span>
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1">From {seller.totalRatings} reviews</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium">Products</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-800">{seller.productsOwned?.length || 0}</span>
                <Package size={20} className="text-indigo-500" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Active Listings</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium">Status</p>
              <p className={`text-lg font-bold mt-1 capitalize ${seller.isBlocked ? 'text-red-500' : 'text-green-500'
                }`}>
                {seller.isBlocked ? 'Blocked' : 'Active'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Account Visibility</p>
            </div>
          </div>

          {/* Verification Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Verification Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Verification Status</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Verified At</span>
                <span className="text-sm text-slate-800 font-mono">
                  {seller.verifiedAt ? new Date(seller.verifiedAt).toLocaleDateString() : 'Not Yet Verified'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 font-medium">Registration Date</span>
                <span className="text-sm text-slate-800 font-mono">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewSellerCompletly;