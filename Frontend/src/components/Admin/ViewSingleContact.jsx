import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { ArrowLeft } from "lucide-react";

const ViewSingleContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch single contact
  const fetchContact = async () => {
    try {
      const res = await axios.get(
        `${ADMIN_API_END_POINT}/contact/${id}`,
        { withCredentials: true }
      );
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

  // Mark as read
  const markAsRead = async () => {
    try {
      setActionLoading(true);
      await axios.patch(
        `${ADMIN_API_END_POINT}/contact/mark-read/${id}`,
        {},
        { withCredentials: true }
      );
      setContact((prev) => ({ ...prev, isRead: true }));
    } catch (error) {
      console.error("Mark as read failed:", error);
    } finally {
      setActionLoading(false);
    }
  };


  const deleteContact = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact request?"
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await axios.delete(
        `${ADMIN_API_END_POINT}/contact/${id}`,
        { withCredentials: true }
      );
      navigate("/admin/contacts"); // back to list page
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading contact details...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6 text-center text-red-500">
        Contact not found
      </div>
    );
  }

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <div className="p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <ArrowLeft size={20} />
        </div>
        Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Contact Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info label="Name" value={contact.name} />
          <Info label="Email" value={contact.email} />
          <Info label="Phone" value={contact.phone} />
          <Info label="Subject" value={contact.subject} />
          <Info
            label="Status"
            value={
              contact.isRead ? (
                <span className="text-green-600 font-semibold">Read</span>
              ) : (
                <span className="text-red-600 font-semibold">Unread</span>
              )
            }
          />
          <Info
            label="Submitted At"
            value={new Date(contact.createdAt).toLocaleString()}
          />
        </div>


        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-1">Message</p>
          <div className="p-4 border rounded-lg bg-gray-50 text-gray-700 whitespace-pre-wrap">
            {contact.message}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          {!contact.isRead && (
            <button
              onClick={markAsRead}
              disabled={actionLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Mark as Read
            </button>
          )}

          <button
            onClick={deleteContact}
            disabled={actionLoading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

export default ViewSingleContact;
