import React, { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  AlertCircle,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";

const TransporterDashboard = () => {
  const [data, setData] = useState({
    totalDeliveries: 120,
    rating: 4.8,
    isAvailable: true,
    verificationStatus: "pending", // pending | approved | rejected
    requestedOrders: 5,
    activeOrders: 2,
    completedOrders: 113
  });

  const toggleAvailability = () => {
    if (data.verificationStatus !== "approved") return;
    setData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="text-orange-500" />
              Transporter Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Overview of your delivery activity
            </p>
          </div>

          {/* AVAILABILITY TOGGLE */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
            <span className={`text-xs font-bold uppercase ${
              data.isAvailable ? "text-green-600" : "text-slate-400"
            }`}>
              {data.isAvailable ? "Online" : "Offline"}
            </span>

            <button
              onClick={toggleAvailability}
              disabled={data.verificationStatus !== "approved"}
              className={`relative h-8 w-14 rounded-full transition-colors ${
                data.isAvailable ? "bg-green-500" : "bg-slate-300"
              } ${data.verificationStatus !== "approved" && "opacity-50 cursor-not-allowed"}`}
            >
              <span
                className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform ${
                  data.isAvailable ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* VERIFICATION WARNING */}
        {data.verificationStatus !== "approved" && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-amber-600" />
            <p className="text-sm text-amber-800">
              Your account is under verification. Order acceptance is disabled.
            </p>
          </div>
        )}

        {/* KPI STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="New Requests" value={data.requestedOrders} icon={<Clock />} />
          <StatCard label="Active Orders" value={data.activeOrders} icon={<Package />} />
          <StatCard label="Completed" value={data.completedOrders} icon={<CheckCircle2 />} />
          <StatCard label="Rating" value={data.rating} icon={<Star />} />
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-sm font-semibold text-orange-600">
              View All
            </button>
          </div>

          {[1, 2].map(i => (
            <div key={i} className="p-5 flex justify-between hover:bg-slate-50">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Order #ORD-{230 + i}</p>
                  <p className="text-xs text-slate-500">
                    Kathmandu → Lalitpur
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

/* STAT CARD */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border">
    <div className="mb-3">{icon}</div>
    <h4 className="text-3xl font-black">{value}</h4>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

export default TransporterDashboard;
