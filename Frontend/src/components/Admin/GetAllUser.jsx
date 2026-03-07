import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, MoreVertical, ShieldCheck, UserCircle } from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const GetAllUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); // "All" | "Seller" | "Transporter"

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/all-users`, { withCredentials: true });
      if (res.data.success) {
        const { sellers, transporters } = res.data.data;
        const formattedUsers = [
          ...sellers.map(user => ({ ...user, role: "seller" })),
          ...transporters.map(user => ({ ...user, role: "transporter" }))
        ];
        setAllUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (activeTab === "All") {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(allUsers.filter(user => user.role === activeTab));
    }
  }, [activeTab, allUsers]);

  const TabButton = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-6 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${activeTab === label
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
        : "text-gray-500 hover:bg-white hover:text-indigo-600"
        }`}
    >
      {label}s
    </button>
  );

  return (
    <div className=" max-w-7xl mx-auto pb-10 p-5">
      <button
        onClick={() => navigate(-1)}
        className=" mb-4 flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>

          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">View and manage roles for all platform members.</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1 self-start">
          <TabButton label="All" />
          <TabButton label="Seller" />
          <TabButton label="Transporter" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan="4" className="px-6 py-4 bg-gray-50/30 h-16"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                    No users found in this category.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-indigo-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                          {user?.profileImage ? (
                            <img src={user?.profileImage?.url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff` } alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-tighter ${user.role === 'Seller'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-xs font-semibold">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/user/${user.role}/${user._id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            Showing {filteredUsers.length} total members
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs border border-gray-200 rounded text-gray-400" disabled>Prev</button>
            <button className="px-3 py-1 text-xs border border-gray-200 rounded text-gray-600 hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllUser;