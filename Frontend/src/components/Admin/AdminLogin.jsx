import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_API_END_POINT } from '@/utils/constants'
import axios from 'axios'
import { Label } from '@/components/ui/label'

const AdminLogin = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/enter-admin`, input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (res.data.success) navigate("/admin/dashboard")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=" min-h-screen flex flex-col md:flex-row lg:flex-row items-center justify-center bg-orange-300">
      <form
        onSubmit={submitHandler}
        className=" w-full max-w-4xl rounded-2xl bg-white overflow-scroll shadow-xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-dark)]">
            Admin Login
          </h2>
          <p className="text-sm text-[var(--text-gray)] mt-1">
            Join E-Haat as an Admin to manage users and products effectively.
          </p>
        </div>

        {/* User Info */}
        <div className="bg-[var(--background-light)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--primary-green)] mb-4">
            Login Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
        
              { label: "Email", name: "email", placeholder: "enter your email" },
              { label: "Password", name: "password", type: "password", placeholder: "Password" },
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
              </div>
            ))}
          </div>
        </div>

       <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300" > Login </button>
      </form>
    
    </div>
  )
}

export default  AdminLogin 
