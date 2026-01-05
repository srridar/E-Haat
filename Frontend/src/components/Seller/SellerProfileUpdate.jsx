import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { SELLER_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { Label } from '@/components/ui/label'

const containerStyle = {
  width: "100%",
  height: "300px"
};

const center = {
  lat: 27.7172,
  lng: 85.3240
};


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

  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const changeFileHandler = (e) => {
    setFormData({ ...formData, file: e.target.files?.[0] });
  }

  const onMapClick = (e) => {
    setFormData({
      ...formData,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    });
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Seller Data:", formData);
    // API call will go here
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

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Select Your Location
            </label>

            <div className="overflow-hidden rounded-xl border border-gray-300">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  onClick={onMapClick}
                >
                  {formData.latitude && (
                    <Marker
                      position={{
                        lat: formData.latitude,
                        lng: formData.longitude,
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading map...
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Click on the map to set your location
            </p>
          </div>

          <div className="flex justify-end pt-4 gap-8">
            <button
              onClick={() => setFormData(initialFormData)}
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium shadow-md transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-md transition-all"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>

  );
};

export default SellerProfileUpdate;
