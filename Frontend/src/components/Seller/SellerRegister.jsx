import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SELLER_API_END_POINT } from '@/utils/constants'
import LocationPicker from '@/components/LocationPicker'
import axios from 'axios'
import { Label } from '@/components/ui/label'

const SellerRegister = () => {

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    latitude: null,
    longitude: null
  })

  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleLocationSelect = ([lat, lng]) => {
    setInput(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        `${SELLER_API_END_POINT}/register`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (res.data.success) navigate("/seller/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=" min-h-screen flex flex-col md:flex-row lg:flex-row items-center justify-center bg-gradient-to-br from-orange-200 to-green-200">
      <img
        src="/crop1.png"
        alt="crop"
        className="w-24 md:w-32 lg:w-60 object-contain"
      />
      <form
        onSubmit={submitHandler}
        className=" w-full max-w-4xl  bg-white overflow-scroll shadow-xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-dark)]">
            Seller Registration
          </h2>
          <p className="text-sm text-[var(--text-gray)] mt-1">
            Join E-Haat and connect with nearby sellers
          </p>
        </div>

        {/* User Info */}
        <div className="bg-[var(--background-light)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--primary-green)] mb-4">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Name", name: "name", placeholder: "Your name / business" },
              { label: "Email", name: "email", placeholder: "Email address" },
              { label: "Password", name: "password", type: "password", placeholder: "Password" },
              { label: "Phone", name: "phone", placeholder: "Phone number" },
              { label: "City", name: "city", placeholder: "City" },
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

        {/* Location Section */}
        <div className="bg-[var(--background-light)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--primary-green)] mb-3">
            Select Your Location
          </h3>

          <div className="rounded-xl overflow-hidden border border-gray-300">
            <LocationPicker onSelect={handleLocationSelect} />
          </div>

          {input.latitude && (
            <p className="text-xs text-[var(--text-gray)] mt-2">
              📍 Selected: {input.latitude.toFixed(4)}, {input.longitude.toFixed(4)}
            </p>
          )}
        </div>

        {/* Submit */}
       <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300" > Register </button>
      </form>
      <img
        src="/crop1.png"
        alt="crop"
        className="w-24 md:w-32 lg:w-60 object-contain"
      />
    </div>
  )
}

export default SellerRegister
