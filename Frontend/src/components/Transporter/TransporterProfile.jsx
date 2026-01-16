import React from "react";
import { 
  User, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Settings, 
  Lock, 
  Trash2, 
  Mail, 
  Phone 
} from "lucide-react";

const TransporterProfile = () => {
  // Mock data for easy customization
  const user = {
    name: "Sushil Bhattarai",
    email: "transporter@gmail.com",
    phone: "98XXXXXXXX",
    status: "Pending",
    vehicle: {
      type: "Bike",
      plate: "LU 2 PA 1234",
      capacity: "50 kg",
      rate: "Rs. 25"
    },
    stats: {
      deliveries: 120,
      rating: 4.5,
      availability: "Online"
    },
    areas: ["Kathmandu", "Lalitpur", "Bhaktapur"]
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
       
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-400" />
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-12 gap-6">
              <div className="h-28 w-28 bg-white rounded-2xl p-1 shadow-lg">
                <div className="h-full w-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                  <User size={40} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                  }`}>
                    {user.status} Verification
                  </span>
                </div>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin size={16} /> Lead Transporter • Kathmandu, NP
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-orange-200">
                  <Settings size={18} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-slate-800">{user.stats.deliveries}</p>
                  <p className="text-xs text-slate-500">Deliveries</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-slate-800 flex items-center gap-1">
                    {user.stats.rating} <Star size={18} className="fill-amber-400 text-amber-400" />
                  </p>
                  <p className="text-xs text-slate-500">Avg Rating</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">Availability Status</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  {user.stats.availability}
                </span>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {user.areas.map((area) => (
                  <span key={area} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED INFO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-slate-700">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><User size={20}/></div>
                  <h3 className="font-bold">Contact Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-1 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Email Address</p>
                      <p className="text-sm font-medium text-slate-700">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="mt-1 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Phone Number</p>
                      <p className="text-sm font-medium text-slate-700">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Truck size={20}/></div>
                  <h3 className="font-bold">Vehicle Logistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Type</p>
                    <p className="text-sm font-semibold text-slate-700">{user.vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Capacity</p>
                    <p className="text-sm font-semibold text-slate-700">{user.vehicle.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Plate No.</p>
                    <p className="text-sm font-semibold text-slate-700 font-mono uppercase tracking-tight">{user.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Rate / KM</p>
                    <p className="text-sm font-semibold text-emerald-600">{user.vehicle.rate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Actions */}
            <div className="bg-slate-100/50 p-6 rounded-2xl border border-dashed border-slate-300">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Security & Account</h3>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                  <Lock size={16} /> Change Password
                </button>
                <button className="flex items-center gap-2 bg-white border border-red-100 hover:bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                  <Trash2 size={16} /> Deactivate Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfile;