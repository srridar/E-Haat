import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Lock,
  LogOut,
  UserPlus,
  Users,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Bell,
  FileBarChart
} from "lucide-react";

const DashBoard = () => {

  const navigate= useNavigate();


  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition
     ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-gray-100">

      <aside className="w-60 min-h-screen text-gray-800 bg-white fixed left-0 top-0">
        <div className="p-5 text-2xl font-bold text-center border-b border-gray-600">
          Admin Panel
        </div>

        <nav className="mt-6 space-y-1 px-2">

          <NavLink to="/admin/dashboard" className={menuItemClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink to="/admin/admin-profile" className={menuItemClass}>
            <User size={20} /> My Profile
          </NavLink>

          <NavLink to="/admin/get-all-users" className={menuItemClass}>
            <Users size={20} /> Users
          </NavLink>

          <NavLink to="/admin/get-all-products" className={menuItemClass}>
            <ShoppingBag size={20} /> Products
          </NavLink>

          <NavLink to="/admin/allorders" className={menuItemClass}>
            <ClipboardList size={20} /> Orders
          </NavLink>

          <NavLink to="/admin/reports" className={menuItemClass}>
            <FileBarChart size={20} /> Reports
          </NavLink>

          <NavLink to="/admin/notifications" className={menuItemClass}>
            <Bell size={20} /> Notifications
          </NavLink>

          <hr className="border-gray-600 my-3" />

          <NavLink to="/admin/sadmin-register" className={menuItemClass}>
            <UserPlus size={20} /> Add Admin
          </NavLink>

          <NavLink to="/admin/settings" className={menuItemClass}>
            <Settings size={20} /> Settings
          </NavLink>

          <NavLink to="/admin/apassword-change" className={menuItemClass}>
            <Lock size={20} /> Change Password
          </NavLink>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-300 transition mt-2"
            onClick={() => console.log("Logout clicked")}
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>


      <main className="ml-60 p-6">

        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-600">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Overview of platform performance
            </p>
          </div>

          <div className="flex gap-6 items-center">
            {/* View Contact Button */}
            <button onClick={()=>navigate("/admin/get-all-contact")} className="mt-3 sm:mt-0 px-5 py-2.5 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 border border-red-700">
              View Contact
            </button>

            {/* Generate Report Button */}
            <button className="mt-3 sm:mt-0 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300 border border-green-700">
              Generate Report
            </button>
          </div>


        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            ["Total Users", "1,240"],
            ["Sellers", "320"],
            ["Transporters", "50"],
            ["Products", "1,850"],
            ["Pending Approvals", "12"],
          ].map(([title, value], i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <p className="text-green-700">{title}</p>
              <h2 className={`text-2xl font-bold mt-2 ${title.includes("Pending") ? "text-red-600" : "text-gray-800"}`}>
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Analytics + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Platform Analytics</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
              Charts will be here
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>New seller registered</span>
                <span className="text-gray-400">2 min ago</span>
              </li>
              <li className="flex justify-between">
                <span>Product approved</span>
                <span className="text-gray-400">10 min ago</span>
              </li>
              <li className="flex justify-between">
                <span>Seller blocked</span>
                <span className="text-gray-400">1 hr ago</span>
              </li>
            </ul>
          </div>
        </div>

      </main>

    </div>
  );
};

export default DashBoard;
