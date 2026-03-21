import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { ArrowLeft, Mail, Phone, Calendar, Trash2, CheckCheck, User } from "lucide-react";

const ViewSingleContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContact = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/contact/${id}`, { withCredentials: true });
      setContact(res.data.contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const markAsRead = async () => {
    try {
      setActionLoading(true);
      await axios.patch(`${ADMIN_API_END_POINT}/contact/read/${id}`, {}, { withCredentials: true });
      setContact((prev) => ({ ...prev, isRead: true }));
    } catch (error) {
      console.error("Mark as read failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContact = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact request?");
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await axios.delete(`${ADMIN_API_END_POINT}/contact/${id}`, { withCredentials: true });
      navigate("/admin/contacts");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-medium">Loading details...</div>;
  if (!contact) return <div className="p-12 text-center text-red-500 font-medium">Contact not found</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all duration-200"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold uppercase tracking-wider">Back to Inbox</span>
        </button>

        {/* Main Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <User size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
                  <p className="text-slate-500 flex items-center gap-1 text-sm">
                    <Calendar size={14} /> 
                    {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                contact.isRead ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {contact.isRead ? "Processed" : "New Inquiry"}
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
            <QuickContact icon={<Mail size={18}/>} label="Email Address" value={contact.email} />
            <QuickContact icon={<Phone size={18}/>} label="Phone Number" value={contact.phone || "N/A"} />
            <QuickContact icon={<CheckCheck size={18}/>} label="Subject" value={contact.subject} />
          </div>

          {/* Message Body */}
          <div className="p-6 md:p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Message Content</h3>
            <div className="relative">
               <span className="absolute -left-2 top-0 text-4xl text-slate-100 font-serif">"</span>
               <p className="text-slate-700 leading-relaxed text-lg italic px-4 whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50 p-6 flex flex-wrap gap-4 border-t border-slate-100">
            {!contact.isRead && (
              <button
                onClick={markAsRead}
                disabled={actionLoading}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
              >
                <CheckCheck size={18} />
                Mark as Read
              </button>
            )}
            <button
              onClick={deleteContact}
              disabled={actionLoading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              <Trash2 size={18} />
              Delete Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean layout
const QuickContact = ({ icon, label, value }) => (
  <div className="p-6 flex items-start gap-3">
    <div className="text-slate-400 mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-slate-800 font-semibold truncate max-w-[200px]">{value}</p>
    </div>
  </div>
);

export default ViewSingleContact;