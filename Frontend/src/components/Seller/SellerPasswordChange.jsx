import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { BUYER_API_END_POINT } from '@/utils/constants';
import axios from "axios";


const SellerPasswordChange = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: ""
  })
  const [confirmpassword, setConfirmpassword] = useState("");

  const navigate = useNavigate();

  const validateInput = ({ oldPassword, newPassword }, confirmpassword) => {
    const errors = {};


    if (!oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    }

    if (oldPassword && newPassword && oldPassword === newPassword) {
      errors.newPassword = "New password must be different from old password";
    }

    if (confirmpassword !== newPassword) {
      errors.confirmpassword = "Confirm password does not match new password";
    }

    const strongPassRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (newPassword && !strongPassRegex.test(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character";
    }

    return errors;
  }

  const changeEventHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput(password, confirmpassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BUYER_API_END_POINT}/changepassword`, password, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log(res.data.success)
      if (res.data.success) {
        navigate("/buyer/profile");
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-2">
      <div className="max-w-lg bg-white rounded-2xl shadow-xl p-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <LockClosedIcon className="h-7 w-7 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          For security reasons, please enter your current password and choose a
          strong new password.
        </p>


        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password </label>
            <input
              type="password"
              name="oldPassword"
              onChange={changeEventHandler}
              placeholder="Enter current password"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.oldPassword && <span className="text-red-500 text-sm">{errors.oldPassword}</span>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"> New Password </label>
            <div className="relative">
              <input onChange={changeEventHandler} name="newPassword" type={showPassword ? "text" : "password"} placeholder="Enter new password"
                className="w-full border rounded-xl px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmpassword"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.confirmpassword && <span className="text-red-500 text-sm">{errors.confirmpassword}</span>}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button disabled={loading} type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition">
              {loading ? "updating ......." : "Update Password"}
            </button>

            <button onClick={() => navigate(-1)} type="button" className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SellerPasswordChange;
