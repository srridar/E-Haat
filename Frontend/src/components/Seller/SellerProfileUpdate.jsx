import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/LocationPicker';
import { SELLER_API_END_POINT } from '@/utils/constants';
import axios from 'axios';
import { Label } from '@/components/ui/label';

const SellerProfileUpdate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    file: null,
    city: "",
    latitude: null,
    longitude: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({}); // To reset on discard


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${SELLER_API_END_POINT}/profile`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const b = res.data.data;
          setFormData({
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.city || "",
            latitude: b.latitude || null,
            longitude: b.longitude || null,
            file: null, // never prefill file
          });
            setInitialData({
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.city || "",
            latitude: b.latitude || null,
            longitude: b.longitude || null,
          });
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const changeFileHandler = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files?.[0] || null
    }));
  };

  const handleLocationSelect = ([lat, lng]) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Validation
  const validateInput = () => {
    const errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^(?:\+977|977)?9[678]\d{8}$/;

    if (formData.name && formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    if (formData.email && !emailReg.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.phone && !phoneReg.test(formData.phone)) {
      errors.phone = "Please enter a valid Nepali phone number";
    }
    if (formData.city && !formData.city.trim()) {
      errors.city = "Please give a valid city name";
    }

    return errors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      if (formData.name) data.append("name", formData.name);
      if (formData.email) data.append("email", formData.email);
      if (formData.phone) data.append("phone", formData.phone);
      if (formData.city) data.append("city", formData.city);

      if (formData.latitude && formData.longitude) {
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
      }

      
      if (formData.file) data.append("profileImage", formData.file);

      const res = await axios.put(
        `${SELLER_API_END_POINT}/update-profile`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate('/seller/profile');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-gray-200 flex justify-center items-start px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl p-8">

        {/* Header */}
        <div className="mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Update Seller Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Keep your personal information up to date</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:outline-none ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm text-gray-600">Email Address</Label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:outline-none ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:outline-none ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:outline-none ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Profile Picture</Label>
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
              {formData.file && <span className="text-sm">{formData.file.name}</span>}
            </div>
          </div>

          {/* Location Picker */}
          <div className="bg-[var(--background-light)] rounded-2xl p-6">
            <h3 className="font-semibold text-[var(--primary-green)] mb-3">Select Your Location</h3>
            <div className="rounded-xl overflow-hidden border border-gray-300">
              <LocationPicker onSelect={handleLocationSelect} />
            </div>
            {formData.latitude && (
              <p className="text-xs text-[var(--text-gray)] mt-2">
                📍 Selected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 gap-8">
            <button
              type="button"
              onClick={() => setFormData(initialData)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium shadow-md transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-md transition-all"
            >
              {loading ? "Saving changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProfileUpdate;
