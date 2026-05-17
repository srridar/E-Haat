import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, LayoutDashboard, FileText, ExternalLink, Package, ArrowUpRight, Search } from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const GetAllOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      picked: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      rejected: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-400';
  };

  if (loading) return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#121212]">
      <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-20 w-20 bg-[#1e1e1e] rounded-3xl border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
      >
        <Leaf size={40} />
      </motion.div>
      <p className="mt-8 font-black uppercase tracking-[0.4em] text-emerald-500/50 text-[10px]">Synchronizing Logistics</p>
    </div>
  );

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();

    return (
      order._id.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term) ||
      order.deliveryLocation?.destinationLocation?.district
        ?.toLowerCase()
        .includes(term) ||
      order.deliveryLocation?.destinationLocation?.province
        ?.toLowerCase()
        .includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-emerald-500">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Package size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Console</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">ORDER LOGISTICS</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time oversight of all digital marketplace transactions.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="text"
                placeholder="Search ID..."
                className="bg-[#1e1e1e] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:border-emerald-500/50 outline-none transition-all w-48 focus:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-gray-200 transition flex items-center gap-2">
              <FileText size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Order Identifier</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Destination</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Inventory</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Revenue</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                          {order._id.slice(-12).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border transition-all duration-300 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-gray-300 uppercase tracking-tight">
                        {order.deliveryLocation?.destinationLocation?.district}
                      </div>
                      <div className="text-[10px] text-gray-600 font-medium">
                        {order.deliveryLocation?.destinationLocation?.province}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-[#121212] px-3 py-1 rounded-md text-[10px] font-mono text-gray-400 border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                        {order.products.length} ITEMS
                      </span>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm font-black text-white">
                      <span className="text-emerald-500 mr-1">Rs.</span>
                      {order.totalCost.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => navigate(`/admin/order/${order._id}`)}
                        className="p-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all border border-indigo-500/20 group/btn"
                      >
                        <ArrowUpRight size={18} className="group-hover/btn:rotate-45 transition-transform" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Package size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No active logs detected</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center px-4">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">System Status: Optimal</p>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">E-HAAT v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default GetAllOrder;