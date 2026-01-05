import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { SELLER_API_END_POINT } from '@/utils/constants';
import axios from 'axios';

const SellerLogin = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${SELLER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      console.log(res.data.success)
      if (res.data.success) {
        navigate("/");
      }

    } catch (error) {
      console.log(error);
    }

  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-greenn)] ">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-[25rem] bg-white shadow-lg rounded-2xl p-6 space-y-5"
      >
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Seller Login
          </h2>
        </div>

        {/* Inputs */}
        <div className=" flex flex-col gap-8">

          <input
            name="email"
            placeholder="Email Address"
            onChange={changeEventHandler}
            className="input-style p-1"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={changeEventHandler}
            className="input-style p-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300"
        >
          Log In
        </button>
      </form>
    </div>
  )
}

export default SellerLogin