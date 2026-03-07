import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${ADMIN_API_END_POINT}/get-all-contact-request`,
        { withCredentials: true }
      );
      setContacts(res.data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Search filter
  const filteredContacts = contacts.filter((contact) =>
    [contact.name, contact.email, contact.subject]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <div className="p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <ArrowLeft size={20} />
        </div>
        Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Contact Queries
        </h1>

        <input
          type="text"
          placeholder="Search by name, email or subject..."
          className="mt-4 sm:mt-0 w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Message</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Submitted At</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Loading contact requests...
                </td>
              </tr>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {contact.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {contact.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {contact.phone}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {contact.subject}
                  </td>

                  <td
                    className="px-6 py-4 text-gray-600 max-w-xs truncate"
                    title={contact.message}
                  >
                    {contact.message}
                  </td>

                  <td className="px-6 py-4">
                    {contact.isRead ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Read
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Unread
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No contact requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewContact;
