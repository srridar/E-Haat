import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Truck, MapPin } from "lucide-react";
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";

const TransporterKycForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenshipCard: null,
    drivingLicense: null,
    vehicleRegistration: null,
    vehicleType: "",
    numberPlate: "",
    capacityKg: "",
    serviceAreas: "",
    pricePerKm: "",
  });

  const [previews, setPreviews] = useState({
    citizenshipCard: null,
    drivingLicense: null,
    vehicleRegistration: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= TEXT INPUT HANDLER =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ================= FILE INPUT HANDLER =================
  const changeFileHandler = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    // 2MB validation
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size must be less than 2MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setPreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }));
  };

  // ================= DISCARD HANDLER =================
  const handleDiscard = () => {
    setFormData({
      citizenshipCard: null,
      drivingLicense: null,
      vehicleRegistration: null,
      vehicleType: "",
      numberPlate: "",
      capacityKg: "",
      serviceAreas: "",
      pricePerKm: "",
    });

    setPreviews({
      citizenshipCard: null,
      drivingLicense: null,
      vehicleRegistration: null,
    });

    setErrors({});
  };

  // ================= SUBMIT HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post(
        `${TRANSPORTER_API_END_POINT}/submitkyc`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        navigate("/transporter/profile");
      }
    } catch (error) {
      console.error("KYC submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg border p-8">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Transporter KYC Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= IDENTITY DOCUMENTS ================= */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
              <FileText className="text-orange-500" />
              Identity Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Citizenship Card */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Citizenship Card
                </label>
                <input
                  type="file"
                  name="citizenshipCard"
                  accept="image/*"
                  required
                  onChange={changeFileHandler}
                  className="w-full border rounded-xl px-4 py-3 mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">Max size: 2MB</p>
                {errors.citizenshipCard && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipCard}
                  </p>
                )}
                {previews.citizenshipCard && (
                  <img
                    src={previews.citizenshipCard}
                    alt="Citizenship Preview"
                    className="mt-3 h-36 w-full object-cover rounded-xl border"
                  />
                )}
              </div>

              {/* Driving License */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Driving License
                </label>
                <input
                  type="file"
                  name="drivingLicense"
                  accept="image/*"
                  required
                  onChange={changeFileHandler}
                  className="w-full border rounded-xl px-4 py-3 mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">Max size: 2MB</p>
                {errors.drivingLicense && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.drivingLicense}
                  </p>
                )}
                {previews.drivingLicense && (
                  <img
                    src={previews.drivingLicense}
                    alt="License Preview"
                    className="mt-3 h-36 w-full object-cover rounded-xl border"
                  />
                )}
              </div>

              {/* Vehicle Registration */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Vehicle Registration
                </label>
                <input
                  type="file"
                  name="vehicleRegistration"
                  accept="image/*"
                  required
                  onChange={changeFileHandler}
                  className="w-full border rounded-xl px-4 py-3 mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">Max size: 2MB</p>
                {errors.vehicleRegistration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vehicleRegistration}
                  </p>
                )}
                {previews.vehicleRegistration && (
                  <img
                    src={previews.vehicleRegistration}
                    alt="Vehicle Preview"
                    className="mt-3 h-36 w-full object-cover rounded-xl border"
                  />
                )}
              </div>

            </div>
          </div>

          {/* ================= VEHICLE INFO ================= */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
              <Truck className="text-orange-500" />
              Vehicle Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="vehicleType"
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select Vehicle Type</option>
                <option value="Truck">Truck</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Bike">Bike</option>
                <option value="Van">Van</option>
              </select>

              <input
                name="numberPlate"
                placeholder="Number Plate"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="capacityKg"
                placeholder="Capacity (KG)"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* ================= SERVICE & PRICING ================= */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
              <MapPin className="text-orange-500" />
              Service & Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="serviceAreas"
                placeholder="Kathmandu, Lalitpur"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                type="number"
                name="pricePerKm"
                placeholder="Price per KM"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 rounded-2xl"
            >
              Discard
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}; 

export default TransporterKycForm;



