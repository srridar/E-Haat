import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User, Settings, Lock, LogOut, UserPlus, Users,
  LayoutDashboard, ShoppingBag, ClipboardList, Bell, ChevronRight, PackageX
} from "lucide-react";
import useLogOut from '@/hooks/sharedHooks/useLogOut.js'
import ApprovalRequest from './ApprovalRequest.jsx'
import PlatformAnalytics from '@/components/Admin/PlatformAnalytics.jsx'
import useGetProfile from "@/hooks/adminHooks/useGetProfile";

const DashBoard = () => {

  const { admin, loading, error } = useGetProfile();
  const [openApprovalPopup, setOpenApprovalPopup] = useState(false);

  const logout = useLogOut("admin");
  const navigate = useNavigate();

  const isSuperAdmin = admin?.role === "superadmin";


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">
            Failed to load dashboard
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
      : "text-gray-200 hover:bg-slate-800 hover:text-indigo-600"
    }`;

  return (
    <div className="min-h-screen text-gray-300 bg-[#000000] flex">
      <aside className="w-64 h-screen text-gray-300 border-r border-indigo-500 fixed left-0 top-0 z-10 flex flex-col">
        <div className="p-4 flex items-center gap-3 group cursor-pointer">
          <div className="relative">

            <div className="absolute inset-0 bg-green-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl rounded-tr-none flex items-center justify-center shadow-lg shadow-green-900/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <div className="w-5 h-5 border-2 border-white/80 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-orange-500">
              E-<span className="text-green-600">Haat</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 ml-0.5">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 mt-2 space-y-1 px-4 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider px-4 mb-2">Main Menu</p>

          <NavLink to="/admin/dashboard" className={menuItemClass}><LayoutDashboard size={19} /> Dashboard</NavLink>
          <NavLink to="/admin/admin-profile" className={menuItemClass}><User size={19} /> My Profile</NavLink>
          <NavLink to="/admin/get-all-users" className={menuItemClass}><Users size={19} /> Users</NavLink>
          <NavLink to="/admin/get-all-products" className={menuItemClass}><ShoppingBag size={19} /> Products</NavLink>
          <NavLink to="/admin/allorders" className={menuItemClass}><ClipboardList size={19} /> Orders</NavLink>
          <NavLink to="/admin/notifications" className={menuItemClass}><Bell size={19} /> Notifications</NavLink>
          <NavLink to="/message/chat" className={menuItemClass}><Bell size={19} /> Message</NavLink>
          <NavLink to="/admin/complaints" className={menuItemClass}><PackageX size={19} /> Complaints</NavLink>


          <div className="my-6  rounded-xl border-gray-400 py-2 ">
            <p className="text-[12px] font-semibold text-green-700 uppercase tracking-wider px-4 mb-2">System</p>
            {isSuperAdmin && (
              <NavLink to="/admin/sadmin-register" className={menuItemClass}>
                <UserPlus size={19} /> Add Admin
              </NavLink>
            )}
            <NavLink to="/admin/apassword-change" className={menuItemClass}><Lock size={19} /> Password</NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-indigo-500">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-200 transition-colors font-medium"
            onClick={() => logout()}
          >
            <LogOut size={19} /> Logout
          </button>
        </div>
      </aside>

     
      <main className="ml-64 flex-1 p-8">
  
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Platform Overview</h1>
            <p className=" text-sm">Welcome back! Here's what's happening today.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/all-contact-data")}
              className="px-4 py-2 bg-gray-500   font-medium rounded-lg hover:bg-gray-600 transition-all"
            >
              View Contacts
            </button>
            <button
              onClick={() => setOpenApprovalPopup(true)}
              className="px-4 py-2 bg-indigo-600  font-medium rounded-lg  hover:bg-indigo-700 transition-all"
            >
              Approval Requests
            </button>
          </div>
        </header>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { title: "Total Users", value: "1,240", color: "text-blue-400" },
            { title: "Sellers", value: "320", color: "text-purple-400" },
            { title: "Transporters", value: "50", color: "text-orange-400" },
            { title: "Products", value: "1,850", color: "text-emerald-400" },
            { title: "Pending Approvals", value: "12", color: "text-red-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-5 border border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-gray-200 uppercase tracking-wider">{stat.title}</p>
              <h2 className={`text-2xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlatformAnalytics />

          <div className="bg-gray-800 rounded-2xl border border-indigo-500 shadow-sm p-6">
            <h2 className="text-lg font-bold text-green-200 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { label: "New seller registered", time: "2 min ago", icon: "bg-blue-100 text-blue-600" },
                { label: "Product approved", time: "10 min ago", icon: "bg-green-100 text-green-600" },
                { label: "Seller blocked", time: "1 hr ago", icon: "bg-red-100 text-red-600" },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.icon.split(' ')[0]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300 leading-none">{activity.label}</p>
                    <p className="text-xs text-gray-300 mt-1">{activity.time}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              View All Logs
            </button>
          </div>
        </div>
      </main>
      <ApprovalRequest open={openApprovalPopup} setOpen={setOpenApprovalPopup} />
    </div>
  );
};

export default DashBoard;