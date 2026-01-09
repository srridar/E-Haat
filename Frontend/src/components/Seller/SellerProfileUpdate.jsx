import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/LocationPicker'
import { SELLER_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { Label } from '@/components/ui/label'



const SellerProfileUpdate = () => {

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    file: null,
    city: "",
    latitude: null,
    longitude: null
  }

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLocationSelect = ([lat, lng]) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }

  const changeFileHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${SELLER_API_END_POINT}/updateprofile`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (res.data.success) {
        navigate('/seller/profile')
      }
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-8 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Update Seller Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Keep your personal information up to date
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <input
                type="text"
                name="name"
                placeholder="Enter seller name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email Address</Label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm text-gray-600">Phone Number</Label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* City */}
            <div>
              <Label className="text-sm text-gray-600">City</Label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Profile Picture */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Profile Picture
            </Label>

            <div className="flex items-center gap-4">

              <label className="cursor-pointer">
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={changeFileHandler}
                />
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition">
                  Upload Image
                </span>
              </label>
            </div>
          </div>

          <div className="bg-[var(--background-light)] rounded-2xl p-6">
            <h3 className="font-semibold text-[var(--primary-green)] mb-3">
              Select Your Location
            </h3>

            <div className="rounded-xl overflow-hidden border border-gray-300">
              <LocationPicker onSelect={handleLocationSelect} />
            </div>

            {formData.latitude && (
              <p className="text-xs text-[var(--text-gray)] mt-2">
                📍 Selected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 gap-8">
            <button onClick={() => setFormData(initialFormData)} type="button" className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium shadow-md transition-all">
              Discard Changes
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-md transition-all" >
              {loading ? "Saving changes" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>

  );
};

export default SellerProfileUpdate;
