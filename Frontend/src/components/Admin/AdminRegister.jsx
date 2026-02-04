import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_API_END_POINT } from '@/utils/constants'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from "lucide-react";

const AdminRegister = () => {

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })

  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }



  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/create-admin`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (res.data.success) navigate("/admin/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row lg:flex-row items-center justify-center  px-4 py-4">
      <div className="flex absolute top-14 md:left-[15rem] rounded bg-green-200 p-1 hover:bg-green-300">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <form
        onSubmit={submitHandler}
        className=" w-full max-w-4xl rounded-2xl bg-white overflow-scroll shadow-xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-dark)]">
            Admin Registration
          </h2>
          <p className="text-sm text-[var(--text-gray)] mt-1">
            Join E-Haat as an Admin to manage users and products effectively.
          </p>
        </div>

        {/* User Info */}
        <div className=" rounded-2xl p-4">
          <h3 className="font-semibold text-[var(--primary-green)] mb-4">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Name", name: "name", placeholder: " enter your name " },
              { label: "Email", name: "email", placeholder: "enter your email" },
              { label: "Password", name: "password", type: "password", placeholder: "Password" },
              { label: "Phone", name: "phone", placeholder: "Phone number" },
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <Label className="text-sm text-[var(--text-gray)]">
                  {field.label}
                </Label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={changeEventHandler}
                  className="
                    w-full
                    rounded-xl
                    border border-gray-300
                    px-4 py-2
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--primary-green)]
                  "
                />

                {
                  field.name === "password" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 text-sm text-green-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                      </ul>
                    </div>
                  )
                }

              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-end items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xl transition duration-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition duration-300"
          >
            Register
          </button>
        </div>


      </form >

    </div >
  )
}

export default AdminRegister
