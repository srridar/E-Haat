import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import useChangePassword from "@/hooks/sharedHooks/useChangePassword";

const TransporterPasswordChange = () => {
  const navigate = useNavigate();
  const changePassword = useChangePassword("transporter");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateInput = ({ oldPassword, newPassword, confirmPassword }) => {
    const errors = {};
    const strongPassRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (oldPassword === newPassword) {
      errors.newPassword =
        "New password must be different from old password";
    } else if (!strongPassRegex.test(newPassword)) {
      errors.newPassword =
        "Minimum 8 chars, 1 uppercase, 1 number, 1 special character";
    }

    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };


  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validateInput(passwords);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwords.oldPassword, passwords.newPassword);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col gap-12 md:gap-40 p-12 md:flex-row lg:flex-row items-center justify-center bg-gray-100 px-4">
      <div className="absolute top-3 left-4 bg-orange-200 p-1 rounded hover:bg-orange-300">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="border-2 rounded-full border-orange-500 p-8 md:p-12  bg-white shadow-xl">
        <img src="/padlock.png" alt="crop" className="w-14 md:w-28 lg:w-40 object-contain" />
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <LockClosedIcon className="h-7 w-7 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Change Password
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Enter your current password and choose a strong new one.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500"
              placeholder="Enter current password"
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 pr-12 focus:ring-2 focus:ring-green-500"
                placeholder="Enter new password"
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
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Rules */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-xl font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>


          </div>
        </form>
      </div>
      <div className="border-2 rounded-full border-orange-500 p-8 md:p-12   bg-white shadow-xl hidden md:block lg:block">
        <img src="/password.png" alt="crop" className="w-14 md:w-28 lg:w-40 object-contain" />
      </div>

    </div>
  );
};

export default TransporterPasswordChange;
