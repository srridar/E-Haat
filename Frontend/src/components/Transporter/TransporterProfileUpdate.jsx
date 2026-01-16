import React, { useState } from "react";
import {  ArrowLeft,  Save,  Camera,  Truck,  MapPin,  User,  Phone} from "lucide-react";
import {useNavigate} from "react-router-dom";

const TransporterProfileUpdate = () => {

  const [formData, setFormData] = useState({
    fullName: "Sushil Bhattarai",
    email: "transporter@gmail.com",
    phone: "98XXXXXXXX",
    vehicleType: "Bike",
    numberPlate: "LU 2 PA 1234",
    capacity: "50",
    rate: "25",
    areas: "Kathmandu, Lalitpur, Bhaktapur"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
    
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors font-medium" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back to Profile
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
            <p className="text-sm text-slate-500">Update your public information and vehicle details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 bg-slate-100 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                   <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <User size={48} />
                   </div>
                </div>
                <button className="absolute -bottom-2 -right-2 bg-orange-500 p-2 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-4 font-bold text-slate-800">{formData.fullName}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Transporter ID: #9921</p>
              
            </div>
          </div>

       
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <User size={20} className="text-orange-500" />
                <h2 className="font-bold text-lg">Personal Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Service Areas (Comma separated)</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      name="areas"
                      value={formData.areas}
                      onChange={handleChange}
                      placeholder="e.g. Kathmandu, Bhaktapur"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VEHICLE LOGISTICS SECTION */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Truck size={20} className="text-blue-500" />
                <h2 className="font-bold text-lg">Vehicle Logistics</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Vehicle Type</label>
                  <select 
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 appearance-none bg-white"
                  >
                    <option>Bike</option>
                    <option>Pickup Truck</option>
                    <option>Van</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Number Plate</label>
                  <input 
                    type="text" 
                    name="numberPlate"
                    value={formData.numberPlate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Capacity (KG)</label>
                  <input 
                    type="number" 
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Base Rate per KM (Rs.)</label>
                  <input 
                    type="number" 
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-bold text-emerald-600"
                  />
                </div>
              </div>
            </div>

            
            <div className="flex items-center justify-end gap-4 pt-4">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-red-400 hover:bg-slate-100 transition-all outline-2-red-500 border border-red-300">
                Cancel
              </button>
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-slate-200">
                <Save size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfileUpdate;