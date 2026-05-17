import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { 
  ArrowLeft, 
  Trash2, 
  Eye, 
  Mail, 
  Inbox, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const GetAllContactForm = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/get-all-contact-request`, { withCredentials: true });
      setContacts(res.data.contacts);
    } catch (error) {
      console.error("Transmission Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Custom styled confirmation would be better, but keeping logic consistent
    if (!window.confirm("Permanent deletion of this communication log?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/contact/${id}`,
        { withCredentials: true }
      );
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Log purged successfully");
    } catch (err) {
      toast.error("Purge failed: Access Denied");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-8 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Scanning Inbox Segments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="group flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-indigo-400 transition-all mb-4"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Command Center
            </button>
            <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Mail className="text-indigo-500" size={28} />
              </div>
              Inquiry <span className="text-indigo-500 opacity-80">Logs</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium italic">Intercepted user communications and support requests.</p>
          </div>

          <div className="bg-[#161616] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <MessageSquare size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest leading-none mb-1">Total Logs</p>
              <span className="text-xl font-mono font-bold text-white">
                {contacts.length.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {contacts.length === 0 ? (
          <div className="relative overflow-hidden bg-[#111] rounded-[2.5rem] border border-white/5 p-24 text-center">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox className="text-gray-600" size={40} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Inbox Secure</h2>
              <p className="text-gray-500 mt-2 text-sm font-medium">No pending communications detected in this sector.</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />
          </div>
        ) : (
          <div className="bg-[#111] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#161616] border-b border-white/5">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Origin Source</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Subject Header</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operations</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.03]">
                  {contacts.map((contact, index) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-white/[0.02] transition-all group"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                            {contact.name}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">{contact.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-300 font-semibold italic line-clamp-1">
                            "{contact.subject}"
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mt-1">
                            LOG_ID: {contact._id.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {contact.isRead ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <CheckCircle size={10} className="mr-1.5" /> Archive
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                            <AlertCircle size={10} className="mr-1.5" /> Priority
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/single-contact/${contact._id}`)}
                            className="p-2.5 bg-[#1A1A1A] text-gray-400 hover:text-white border border-white/5 hover:border-indigo-500/50 rounded-xl transition-all active:scale-90"
                            title="Open Channel"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="p-2.5 bg-[#1A1A1A] text-gray-600 hover:text-red-500 border border-white/5 hover:border-red-500/50 rounded-xl transition-all active:scale-90"
                            title="Purge Log"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <div className="fixed bottom-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-600/[0.02] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default GetAllContactForm;