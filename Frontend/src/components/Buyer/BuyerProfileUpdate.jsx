import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPicker from "@/components/LocationPicker";
import { BUYER_API_END_POINT } from "@/utils/constants";
import { Label } from "@/components/ui/label";

const BuyerProfileUpdate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    latitude: null,
    longitude: null,
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({}); // To reset on discard


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BUYER_API_END_POINT}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const b = res.data.data;
          setFormData({
            name: b.name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.city || "",
            latitude: b.latitude || null,
            longitude: b.longitude || null,
            file: null,
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
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const handleLocationSelect = ([lat, lng]) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };


  const validateInput = () => {
    const errors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^(?:\+977|977)?9[678]\d{8}$/;

    if (formData.name && formData.name.length < 3)
      errors.name = "Name must be at least 3 characters";

    if (formData.email && !emailReg.test(formData.email))
      errors.email = "Invalid email address";

    if (formData.phone && !phoneReg.test(formData.phone))
      errors.phone = "Invalid Nepali phone number";

    if (formData.city && !formData.city.trim())
      errors.city = "Please provide a valid city name";

    return errors;
  };

  /* ================================
     FORM SUBMISSION
  =================================== */
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

      // Only append fields that have values
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
        `${BUYER_API_END_POINT}/update-profile`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        navigate("/buyer/profile");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-gray-200 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Update Buyer Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <Label>Full Name</Label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* City */}
            <div>
              <Label>City</Label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Profile Image</Label>
            <input type="file" onChange={handleFileChange} />
            {formData.file && (
              <img
                src={URL.createObjectURL(formData.file)}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover border"
              />
            )}
          </div>

          {/* Location Picker */}
          <div>
            <Label>Location</Label>
            <LocationPicker onSelect={handleLocationSelect} />
            {formData.latitude && formData.longitude && (
              <p className="text-sm mt-2">
                📍 Selected: {formData.latitude.toFixed(4)},{" "}
                {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData(initialData)}
              className="px-6 py-2 border rounded-lg"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerProfileUpdate;
