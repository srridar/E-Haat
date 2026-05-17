import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle, ShieldCheck, ShieldAlert } from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const GetAllUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const navigate = useNavigate();

  const blockAndUnblock = async ({ id, role, action }) => {
    try {
      const res = await axios.put(`${ADMIN_API_END_POINT}/block-unblock`, { id, role, action }, { withCredentials: true });
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Something went wrong" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Server error. Try again later.",
      };
    }
  };

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

  useEffect(() => {
    if (activeTab === "All") {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(
        allUsers.filter((user) => user.role.toLowerCase() === activeTab.toLowerCase())
      );
    }
  }, [activeTab, allUsers]);

  const TabButton = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      className={`px-6 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${
        activeTab === label
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}s
    </button>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
      <div className="mx-auto pb-10 p-5 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage platform members, monitor status, and control access.
            </p>
          </div>

          <div className="bg-[#1e1e1e] p-1.5 rounded-xl flex gap-1 self-start border border-gray-800">
            <TabButton label="All" />
            <TabButton label="Seller" />
            <TabButton label="Transporter" />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#252525] border-b border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  [1, 2, 3].map((n) => (
                    <tr key={n} className="animate-pulse">
                      <td colSpan="4" className="px-6 py-8 bg-gray-800/20 h-16"></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500 italic">
                      No users found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="group hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden">
                            {user?.profileImage ? (
                              <img 
                                src={user?.profileImage?.url || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <UserCircle size={26} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          user.role.toLowerCase() === 'seller'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <div className="flex items-center gap-1.5 text-red-400">
                            <ShieldAlert size={14} />
                            <span className="text-xs font-medium">Blocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-medium">Active</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/user/${user.role}/${user._id}`)}
                            className="px-4 py-1.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={async () => {
                              const action = user.isBlocked ? "unblock" : "block";
                              const res = await blockAndUnblock({ id: user._id, role: user.role, action });
                              if (res.success) {
                                setAllUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
                              } else {
                                alert(res.message);
                              }
                            }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              user.isBlocked
                                ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                : "text-red-400 border-red-500/30 hover:bg-red-500/10"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 bg-[#252525] border-t border-gray-800 flex justify-between items-center">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="text-gray-300">{filteredUsers.length}</span> members
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs font-semibold bg-gray-800 border border-gray-700 rounded-md text-gray-500 cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-1.5 text-xs font-semibold bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 hover:border-gray-600 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllUser;