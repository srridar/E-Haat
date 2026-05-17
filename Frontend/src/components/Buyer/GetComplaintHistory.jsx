import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  History, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Truck,
  Store,
  PackageCheck
} from "lucide-react";

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v4/buyer/complaints/history", {
          withCredentials: true
        });
        if (res.data.success) setComplaints(res.data.complaints);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: <CheckCircle2 size={14}/> };
      case "pending": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", icon: <Clock size={14}/> };
      case "under_review": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", icon: <AlertCircle size={14}/> };
      case "rejected": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", icon: <XCircle size={14}/> };
      default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-100", icon: <History size={14}/> };
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c._id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Complaint History 
              <span className="text-sm font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">{complaints.length}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">Track and monitor your active disputes and past resolutions.</p>
          </div>

          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Issue..."
              className="input w-full pl-12 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-ring loading-lg text-rose-500"></span>
            <p className="text-slate-400 font-bold mt-4 animate-pulse uppercase tracking-widest text-xs">Retrieving Audit Logs...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <PackageCheck className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No complaints found</h3>
            <p className="text-slate-500 mt-2">Looks like your shopping experience has been smooth!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((item) => {
              const style = getStatusStyle(item.status);
              return (
                <div key={item._id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    
                    {/* Status & Date Side */}
                    <div className="md:w-48 shrink-0 space-y-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                        {style.icon} {item.status.replace('_', ' ')}
                      </div>
                      <div className="pl-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filed On</p>
                        <p className="text-slate-900 font-bold">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-black text-slate-800 capitalize leading-none">
                            {item.issueType.replaceAll('_', ' ')}
                          </h2>
                          <p className="text-slate-400 text-xs font-mono mt-2 uppercase tracking-tighter">ID: #{item._id.slice(-12)}</p>
                        </div>
                        <button className="btn btn-ghost btn-circle text-slate-300 hover:text-rose-500">
                          <ExternalLink size={20} />
                        </button>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 italic border-l-4 border-slate-100 pl-4">
                        "{item.description}"
                      </p>

                      {/* Participant Footer */}
                      <div className="pt-4 flex flex-wrap gap-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Store size={14}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Seller</p>
                            <p className="text-xs font-black text-slate-700">{item.seller?.fullname || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Truck size={14}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Courier</p>
                            <p className="text-xs font-black text-slate-700">{item.transporter?.fullname || 'In-House'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action */}
                    <div className="md:w-32 flex items-center justify-center md:border-l border-slate-50">
                      <button className="flex items-center gap-2 text-xs font-black text-rose-500 hover:gap-4 transition-all">
                        DETAILS <ChevronRight size={16} strokeWidth={3} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintHistory;