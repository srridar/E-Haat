import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TRANSPORTER_API_END_POINT } from '@/utils/constants';
import axios from "axios";

const TransporterLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const validateInput = ({ email, password }) => {
    const errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailReg.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  }

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  

  const submitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput(input);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${TRANSPORTER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log(res.data.success)
      if (res.data.success) {
        navigate("/transporter/profile");
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }

  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row lg:flex-row gap-8 items-center justify-center bg-gradient-to-br from-orange-300 to-green-100  px-4">
      <img
        src="/truck.png"
        alt="crop"
        className="w-24 md:w-32 lg:w-60 object-contain"
      />
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6"
      >

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-800">
            Transporter Login
          </h2>
          <p className="text-sm text-gray-500">
            Access your E-Haat transporter dashboard
          </p>
          <div className="w-14 h-1 bg-[var(--primary-green)] mx-auto mt-3 rounded-full" />
        </div>

        {/* Inputs */}
        <div className="space-y-5">

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              value={input.email}
              placeholder="Email address"
              onChange={changeEventHandler}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-green)] focus:outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              value={input.password}
              placeholder="Password"
              onChange={changeEventHandler}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-green)] focus:outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

        </div>

        {/* Extra options */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Secure login</span>
          <button
            type="button"
            className="text-[var(--primary-green)] hover:underline font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[var(--primary-green)] hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 pt-2">
          New to E-Haat?{" "}
          <span className="text-[var(--secondary-orange)] font-medium cursor-pointer hover:underline">
            Create a transporter account
          </span>
        </p>

      </form>
      <img
        src="/truck.png"
        alt="crop"
        className="w-24 md:w-32 lg:w-60 object-contain"
      />
    </div>

  )
}

export default TransporterLogin