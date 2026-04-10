import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { LayoutDashboard, FileText, ExternalLink } from "lucide-react";

const GetAllOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${ADMIN_API_END_POINT}/get-all-orders`, { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
      picked: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      rejected: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-white/80 backdrop-blur-md">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100 rounded-full blur-[100px] opacity-50" />
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />

          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Leaf size={32} strokeWidth={2.5} />
          </div>
        </motion.div>

        <div className="text-center space-y-2">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-slate-800 tracking-tight"
          >
            Fetching your Harvest...
          </motion.h3>

          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
            ))}
          </div>
        </div>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-50">
          E-HAAT DIGITAL MARKETPLACE
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutDashboard size={24} /> Order Management
            </h1>
            <p className="text-slate-500 text-sm">Monitor and manage all customer shipments</p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
            <FileText size={16} /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Destination</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Revenue</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {order.deliveryLocation.destinationLocation.district}, {order.deliveryLocation.destinationLocation.province}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">{order.products.length}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">Rs. {order.totalCost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/order/${order._id}`)}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                      >
                        Manage <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllOrder;