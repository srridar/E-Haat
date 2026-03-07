import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Added missing import
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { 
  ArrowLeft, 
  Trash2, 
  Eye, 
  Mail, 
  Inbox, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react"; // Modern icons

const GetAllContactForm = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/get-all-contact-request`, { withCredentials: true });
      setContacts(res.data.contacts);
    } catch (error) {
      console.error("Failed to fetch contacts: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/contact/${id}`,
        { withCredentials: true }
      );
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
        <div className="h-64 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-2"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </button>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="text-indigo-600" /> Contact Messages
            </h2>
            <p className="text-gray-500 mt-1">Manage and respond to user inquiries.</p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-600">Total Requests: </span>
            <span className="text-lg font-bold text-indigo-600">{contacts.length}</span>
          </div>
        </div>

        {/* Main Content */}
        {contacts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">Your inbox is currently empty.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact, index) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{contact.name}</span>
                          <span className="text-sm text-gray-500">{contact.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 line-clamp-1 italic">
                          "{contact.subject}"
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.isRead ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" /> Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <AlertCircle size={12} className="mr-1" /> Unread
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/contact/${contact._id}`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                            title="View Message"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Message"
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
    </div>
  );
};

export default GetAllContactForm;