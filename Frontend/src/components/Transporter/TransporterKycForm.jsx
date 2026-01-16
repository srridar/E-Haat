import React, { useState } from "react";
import axios from "axios";
import { FileText, Truck, MapPin, IndianRupee } from "lucide-react";

const TransporterKycForm = () => {
  const [formData, setFormData] = useState({
    citizenshipId: "",
    drivingLicense: "",
    vehicleRegistration: "",
    vehicleType: "",
    numberPlate: "",
    capacityKg: "",
    serviceAreas: "",
    pricePerKm: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/api/v1/transporter/kyc",
        formData,
        { withCredentials: true }
      );

      setMessage({ type: "success", text: "KYC submitted successfully. Verification pending." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "KYC submission failed"
      });
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

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= DOCUMENT INFO ================= */}
          <Section title="Identity Documents" icon={<FileText />}>
            <Input label="Citizenship ID" name="citizenshipId" onChange={handleChange} />
            <Input label="Driving License No." name="drivingLicense" onChange={handleChange} />
            <Input label="Vehicle Registration No." name="vehicleRegistration" onChange={handleChange} />
          </Section>

          {/* ================= VEHICLE INFO ================= */}
          <Section title="Vehicle Information" icon={<Truck />}>
            <Input label="Vehicle Type (Truck / Pickup / Bike)" name="vehicleType" onChange={handleChange} />
            <Input label="Number Plate" name="numberPlate" onChange={handleChange} />
            <Input label="Capacity (KG)" type="number" name="capacityKg" onChange={handleChange} />
          </Section>

          {/* ================= SERVICE & PRICING ================= */}
          <Section title="Service & Pricing" icon={<MapPin />}>
            <Input
              label="Service Areas (comma separated)"
              name="serviceAreas"
              placeholder="Kathmandu, Lalitpur, Bhaktapur"
              onChange={handleChange}
            />
            <Input
              label="Price per KM (Rs)"
              type="number"
              name="pricePerKm"
              icon={<IndianRupee size={16} />}
              onChange={handleChange}
            />
          </Section>

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit KYC"}
          </button>

        </form>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, icon, children }) => (
  <div>
    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
      <span className="text-orange-500">{icon}</span>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3 text-slate-400">{icon}</span>}
      <input
        required
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          icon ? "pl-10" : ""
        }`}
        {...props}
      />
    </div>
  </div>
);

export default TransporterKycForm;
