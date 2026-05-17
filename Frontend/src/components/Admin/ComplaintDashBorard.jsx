import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCcw,
  BadgeDollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  User,
  Store,
  ShieldAlert,
  Eye,
  Calendar,
  Layers
} from "lucide-react";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    complaintType: "",
    page: 1,
    limit: 10
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v4/admin/monitor", {
        params: filters,
        withCredentials: true
      });
      if (res.data.success) setComplaints(res.data.complaints);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchComplaints(); 
  }, [filters]);

  // Handle administrative decision flow actions
  const updateComplaintStatus = async (complaintId, nextStatus) => {
    try {
      // Replace URL path below with your correct admin execution routing destination
      const res = await axios.patch(`http://localhost:8000/api/v4/admin/complaint/${complaintId}`, 
        { status: nextStatus },
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Hot-reload localized entry state inside view array layout instantly
        setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: nextStatus } : c));
        setSelectedComplaint(prev => prev && prev._id === complaintId ? { ...prev, status: nextStatus } : prev);
      }
    } catch (err) {
      console.error("Failed to commit status adjustment:", err);
    }
  };

  // Stat metrics computation indicators 
  const stats = [
    { label: "Pending", value: complaints.filter(c => c.status === 'pending').length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Resolved", value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Refunded", value: complaints.filter(c => c.status === 'refunded').length, icon: BadgeDollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  ];

  // Visual dynamic mapping rules dictionary for complaint status badges
  const statusConfig = {
    pending: { label: "Pending", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    under_review: { label: "Under Review", style: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
    resolved: { label: "Resolved", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    rejected: { label: "Rejected", style: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
    refunded: { label: "Refunded", style: "bg-purple-500/10 text-purple-400 border-purple-200/30" }
  };

  // Local client filter parsing matches
  const filteredComplaints = complaints.filter(c => {
    const matchesBuyer = c.buyer?.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeller = c.seller?.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesId = c._id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBuyer || matchesSeller || matchesId;
  });

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-slate-100 font-sans tracking-tight antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR BRAND HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="text-indigo-500" size={32} />
              Complaints Center
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Resolution Hub & Administrative Dispute Monitoring</p>
          </div>
          
          <button 
            onClick={fetchComplaints} 
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin text-indigo-400" : ""} />
            Sync Vault Data
          </button>
        </div>

        {/* QUICK METRICS METERS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className={`p-5 rounded-2xl bg-slate-800/40 border backdrop-blur-sm flex items-center gap-4 ${stat.bg}`}>
                <div className={`p-3 rounded-xl bg-slate-900/60 ${stat.color}`}>
                  <IconComponent size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTROLS & FILTER PANELS ROW */}
        <div className="bg-slate-800/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between backdrop-blur-sm">
          
          {/* Real-time Query Input Box */}
          <div className="relative w-full lg:w-96 text-slate-400">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, buyer, or seller name..." 
              className="w-full bg-slate-900/60 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all" 
            />
          </div>

          {/* Select Query State Options */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select 
              value={filters.status}
              className="flex-1 lg:flex-none bg-slate-900/60 border border-slate-700/80 focus:border-indigo-500 text-xs font-semibold text-slate-300 rounded-xl px-4 py-2.5 outline-none transition-all cursor-pointer min-w-[140px]"
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="" className="bg-slate-900 text-slate-300">All Statuses</option>
              <option value="pending" className="bg-slate-900 text-slate-300">Pending</option>
              <option value="under_review" className="bg-slate-900 text-slate-300">Under Review</option>
              <option value="resolved" className="bg-slate-900 text-slate-300">Resolved</option>
              <option value="refunded" className="bg-slate-900 text-slate-300">Refunded</option>
              <option value="rejected" className="bg-slate-900 text-slate-300">Rejected</option>
            </select>

            <select 
              value={filters.complaintType}
              className="flex-1 lg:flex-none bg-slate-900/60 border border-slate-700/80 focus:border-indigo-500 text-xs font-semibold text-slate-300 rounded-xl px-4 py-2.5 outline-none transition-all cursor-pointer min-w-[140px]"
              onChange={(e) => setFilters({...filters, complaintType: e.target.value})}
            >
              <option value="" className="bg-slate-900 text-slate-300">All Categories</option>
              <option value="damaged_product" className="bg-slate-900 text-slate-300">Damaged Items</option>
              <option value="fake_product" className="bg-slate-900 text-slate-300">Counterfeit / Fake</option>
            </select>
          </div>
        </div>

        {/* ARCHITECTURE DISPUTE DATA TABLE */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-700/60 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="py-4.5 px-6">Involved Stakeholders</th>
                  <th className="py-4.5 px-4">Dispute Category</th>
                  <th className="py-4.5 px-4">Status State</th>
                  <th className="py-4.5 px-4">Financial Exposure</th>
                  <th className="py-4.5 px-4">Filing Date</th>
                  <th className="py-4.5 px-6 text-right">Audit Lifecycle</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-24">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCcw className="animate-spin text-indigo-500" size={28} />
                        <span className="text-slate-500 font-medium">Re-indexing complaints database records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 font-medium text-slate-500">
                      No matching historical dispute files located inside this filter matrix index.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => {
                    const badge = statusConfig[c.status] || { label: c.status, style: "bg-slate-700/20 text-slate-400 border-slate-700" };
                    return (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold text-slate-200">
                              <User size={13} className="text-indigo-400 shrink-0" /> 
                              <span>{c.buyer?.fullname || "Anonymous Buyer"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                              <Store size={13} className="text-slate-500 shrink-0" /> 
                              <span className="truncate max-w-[160px]">{c.seller?.fullname || "Merchant Entity"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-300 capitalize">
                          {c.issueType ? c.issueType.replace('_', ' ') : "General Dispute"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border uppercase ${badge.style}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-indigo-300 text-sm">
                          Rs. {c.refundAmount?.toLocaleString() || "0"}
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-500" />
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "---"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => setSelectedComplaint(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-600 rounded-lg font-bold transition-all cursor-pointer"
                          >
                            Review File <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL AUDIT SCREEN COMPONENT */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-800 border border-slate-700/80 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Top Segment */}
              <div className="bg-slate-900 border-b border-slate-700/60 p-5 flex justify-between items-center shrink-0">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                    <AlertCircle className="text-amber-400" size={18} /> 
                    Case Audit File: #{selectedComplaint._id?.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                    REGISTRATION TIMESTAMP: {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)} 
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content Scroll Body */}
              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Side Content Column */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={12} className="text-indigo-400" /> Statements & Narrative Claim
                    </h4>
                    <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-slate-300 leading-relaxed text-xs italic">
                      "{selectedComplaint.description || "No localized textual description argument filed for this incident entry model."}"
                    </div>
                  </div>

                  {/* Proof Attachment Image Galleries Layout Grid */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted Physical Evidence Blocks</h4>
                    {selectedComplaint.proofImages?.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedComplaint.proofImages.map((img, i) => (
                          <div key={i} className="relative aspect-video bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden group shadow-md">
                            <img 
                              src={img.url} 
                              alt="dispute evidence block asset" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-slate-900/30 border border-dashed border-slate-700 rounded-xl text-slate-500 text-xs">
                        No image confirmation receipts or visual attachments cataloged for this case.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel Control Decision Column */}
                <div className="space-y-5">
                  <div className="bg-slate-900/40 border border-slate-700/40 p-5 rounded-2xl space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                      Decision Action Panel
                    </h4>
                    
                    {/* Active Workflow Progression State Monitor */}
                    <div className="text-[11px] font-medium text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl flex justify-between">
                      <span>Current System State:</span>
                      <span className="font-bold text-indigo-400 uppercase">{selectedComplaint.status}</span>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => updateComplaintStatus(selectedComplaint._id, "under_review")}
                        disabled={selectedComplaint.status === "under_review"}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Transition Under Review
                      </button>
                      <button 
                        onClick={() => updateComplaintStatus(selectedComplaint._id, "resolved")}
                        disabled={selectedComplaint.status === "resolved"}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/10 cursor-pointer"
                      >
                        Approve & Resolve Case
                      </button>
                      <button 
                        onClick={() => updateComplaintStatus(selectedComplaint._id, "rejected")}
                        disabled={selectedComplaint.status === "rejected"}
                        className="w-full py-2.5 bg-transparent hover:bg-rose-500/10 disabled:opacity-40 border-2 border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Reject Complaint Entry
                      </button>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Financial Override</span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    <button 
                      onClick={() => updateComplaintStatus(selectedComplaint._id, "refunded")}
                      disabled={selectedComplaint.status === "refunded"}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-950 disabled:opacity-40 text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BadgeDollarSign size={14} /> Force Escrow Refund
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComplaintManagement;