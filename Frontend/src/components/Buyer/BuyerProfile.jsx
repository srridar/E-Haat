import React, { useState } from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const BuyerProfile = () => {
  const [setting, setSetting] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex gap-24">

      {/* Sidebar */}
      <div className="h-[40rem] w-1/5 rounded-2xl bg-white shadow">
        <div className="bg-[var(--secondary-orange-lite)] rounded-2xl shadow p-6 flex items-center gap-6">
          <img
            src="logo.png"
            alt="Buyer Profile"
            className="w-10 h-10 rounded-full border-2 border-green-600"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Buyer Name</h2>
            <p className="text-gray-700">buyer@email.com</p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-5 mt-6">
          <MenuItem icon={UserIcon} label="Profile" />
          <MenuItem icon={Cog6ToothIcon} label="Setting" onClick={() => setSetting(true)} />
          <MenuItem icon={CubeIcon} label="My Orders" />
          <MenuItem icon={BellIcon} label="Notification" />
          <MenuItem icon={ArrowRightOnRectangleIcon} label="Log Out" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <img
            src="logo.png"
            alt="Buyer Profile"
            className="w-28 h-28 rounded-full border-4 border-green-600"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Buyer Name</h2>
            <p className="text-gray-500">buyer@email.com</p>
          </div>
          <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl">
            Edit Profile
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <p><b>Phone:</b> +977-9847434512</p>
            <p><b>City:</b> Butwal</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow p-6 flex gap-4 justify-end">
          <button className="px-5 py-2 border border-green-600 text-green-600 rounded-xl">
            Change Password
          </button>
          <button className="px-5 py-2 border border-red-500 text-red-500 rounded-xl">
            Delete Account
          </button>
        </div>

      </div>

      {/* Settings Modal */}
      {setting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button onClick={() => setSetting(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <hr className="my-4" />

            <SettingRow label="Theme" value="Light" />
            <SettingRow label="Language" value="Eng" />
          </div>
        </div>
      )}
    </div>
  );
};

/* Small reusable components */
const MenuItem = ({ icon: Icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 cursor-pointer hover:text-green-600"
  >
    <Icon className="h-6 w-6" />
    <span>{label}</span>
  </div>
);

const SettingRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3">
    <span>{label}</span>
    <div className="flex items-center gap-2 cursor-pointer">
      <span>{value}</span>
      <ChevronDownIcon className="h-5 w-5" />
    </div>
  </div>
);

export default BuyerProfile;
