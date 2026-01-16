import React, { useState , useEffect} from "react";
import { UserIcon, Cog6ToothIcon, BellIcon, CubeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Notification from '@/components/shared/Notification'
import { useNavigate } from 'react-router-dom';
import useLogOut from '@/hooks/buyerHooks/useLogOut.js'
import useGetProfile from '@/hooks/buyerHooks/useGetProfile'


const BuyerProfile = () => {

  const [showNotification, setShowNotification] = useState(false);
  const [buyer, setBuyer]=useState({});

  const [setting, setSetting] = useState(false);
  const navigate = useNavigate();

  const logout = useLogOut("buyer");
  const getProfile = useGetProfile("buyer");

  useEffect(() => {
    const fetchprofile= async()=>{
      const profile = await getProfile();
      if(profile){
        setBuyer(profile);
      }
      console.log(profile)
    }

    fetchprofile();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-start items-start gap-24 ">

      <div className="h-[40rem] w-1/5 rounded-2xl bg-white shadow">
        <div className="bg-[var(--secondary-orange-lite)] rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={`${buyer?.profileImage || "https://ui-avatars.com/api/?name=Buyer&background=5A8F2B&color=fff"}`}
            alt="Buyer Profile"
            className="w-10 h-10 rounded-full border-2 border-green-600"
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {buyer?.name}
            </h2>
            <p className="text-gray-700">{buyer?.email}</p>
          </div>
        </div>
        <div className="p-1 flex flex-col gap-6 mt-6">
          <div className="flex px-2 py-2 gap-4 items-center">
            <UserIcon className="h-6 w-6" />
            <h2 className="text-md cursor-pointer">Profile</h2>
          </div>
          <div className="flex px-2 py-2 gap-4 items-center" onClick={() => setSetting(true)}>
            <Cog6ToothIcon className="h-6 w-6" />
            <h2 className="text-md cursor-pointer">Setting</h2>
          </div>
          <div className="flex px-2 py-2 gap-4 items-center" onClick={() => navigate("/buyer/all-orders")}>
            <CubeIcon className="h-6 w-6" />
            <h2 className="text-md cursor-pointer">My Orders</h2>
          </div>
          <div className="flex px-2 py-2 gap-4 items-center " onClick={() => setShowNotification(true)}>
            <BellIcon className="h-6 w-6" />
            <h2 className="text-md cursor-pointer">Notification</h2>
          </div>
          <button
            onClick={logout}
            className="flex px-2 py-2 gap-4 items-center w-full text-left"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={`${buyer?.profileImage || "https://ui-avatars.com/api/?name=Buyer&background=5A8F2B&color=fff"}`}
            alt="buyer Profile"
            className="w-28 h-28 rounded-full border-4 border-green-600"
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {buyer?.name}
            </h2>
            <p className="text-gray-500">{buyer?.email}</p>
          </div>

          <button onClick={()=>navigate("/buyer/profile/update")} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition">
            Edit Profile
          </button>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Phone:</span> {buyer?.phone}</p>
              <p><span className="font-medium text-gray-800">City:</span> {buyer?.location?.city}</p>
              
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap gap-4 justify-center md:justify-end">
          <button onClick={() => navigate("/buyer/change-password")} className="px-5 py-2 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition">
            Change Password
          </button>
          <button className="px-5 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition">
            Delete Account
          </button>
        </div>

      </div>

      {showNotification && <Notification onClose={() => setShowNotification(false)} />}

      {setting && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Settings
            </h2>
            <button
              onClick={() => setSetting(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <hr className="my-4" />

          {/* Theme */}
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700 text-base">Theme</span>
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <span>Light</span>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </div>

          {/* Language */}
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700 text-base">Language</span>
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <span>Eng</span>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </div>

        </div>
      </div>)}
    </div>
  );
};

export default BuyerProfile;
