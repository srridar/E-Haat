import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
import {
  FileText, Truck, MapPin, Upload, X, CheckCircle2,
  ChevronLeft, Loader2, CreditCard, Info
} from "lucide-react";
import { TRANSPORTER_API_END_POINT } from "@/utils/constants";

const TransporterKycForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const [formData, setFormData] = useState({
    citizenshipCard: null,
    drivingLicense: null,
    vehicleRegistration: null,
    vehiclePhoto: null,
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
    vehiclePhoto: null
  });


  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "vehicleType":
        if (!value) error = "Please select a vehicle type";
        break;
      case "numberPlate":
        if (!value.trim()) error = "Number plate is required";
        else if (value.length < 5) error = "Invalid number plate format";
        break;
      case "capacityKg":
        if (!value || value <= 0) error = "Capacity must be greater than 0";
        break;
      case "pricePerKm":
        if (!value || value <= 0) error = "Price must be greater than 0";
        break;
      case "serviceAreas":
        if (!value.trim()) error = "Please specify at least one service area";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const changeFileHandler = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

   
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Only JPG, PNG or PDF allowed" }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [fieldName]: "File exceeds 3MB limit" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [fieldName]: file }));
    if (file.type.startsWith("image/")) {
      setPreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    } else {
      setPreviews((prev) => ({ ...prev, [fieldName]: "pdf-placeholder" })); // Handle PDF UI if needed
    }
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const removeFile = (fieldName) => {
    if (previews[fieldName]) URL.revokeObjectURL(previews[fieldName]);
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Text Fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === "string" || formData[key] === "") {
        const err = validateField(key, formData[key]);
        if (err) newErrors[key] = err;
      }
    });

    // Validate Required Files
    const requiredFiles = ["citizenshipCard", "drivingLicense", "vehicleRegistration", "vehiclePhoto"];
    requiredFiles.forEach(fileKey => {
      if (!formData[fileKey]) {
        newErrors[fileKey] = "This document is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.text-red-500');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post(`${TRANSPORTER_API_END_POINT}/submitkyc`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        navigate("/transporter/profile");
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: error.response?.data?.message || "KYC submission failed. Please try again." }));
      console.error("KYC submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  const FileUploadField = ({ label, name }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        {label} {formData[name] && <CheckCircle2 size={14} className="text-green-500" />}
      </label>

      <div className={`relative group border-2 border-dashed rounded-2xl transition-all duration-200 h-44 flex flex-col items-center justify-center overflow-hidden
        ${errors[name] ? 'border-red-300 bg-red-50' : previews[name] ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-400 hover:bg-slate-50'}`}>

        {previews[name] ? (
          <>
            {previews[name] === "pdf-placeholder" ? (
              <div className="flex flex-col items-center text-slate-500">
                <FileText size={40} />
                <span className="text-xs mt-2">PDF Document</span>
              </div>
            ) : (
              <img src={previews[name]} alt="preview" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => removeFile(name)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <div className="p-3 bg-slate-100 rounded-full text-slate-500 group-hover:scale-110 transition-transform duration-200">
              <Upload size={24} />
            </div>
            <span className="text-xs font-medium text-slate-500 mt-2">Click to upload {label}</span>
            <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF up to 3MB</span>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => changeFileHandler(e, name)}
            />
          </label>
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 sm:px-5">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-indigo-800 tracking-tight">KYC Verification</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center justify-end gap-1">
              <Info size={14} /> Complete your profile to start taking orders
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.server && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {errors.server}
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Identity & Legal Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FileUploadField label="Citizenship Card" name="citizenshipCard" />
              <FileUploadField label="Driving License" name="drivingLicense" />
              <FileUploadField label="Vehicle Registration" name="vehicleRegistration" />
              <FileUploadField label="Vehicle Photo" name="vehiclePhoto" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-2 border-b border-slate-50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Truck size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Vehicle Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.vehicleType ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                >
                  <option value="">Select Type</option>
                  {["Truck", "Mini Truck", "Bike", "Van"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && <p className="text-red-500 text-[10px] font-medium">{errors.vehicleType}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Number Plate</label>
                <input
                  name="numberPlate"
                  value={formData.numberPlate}
                  placeholder="BA 1 PA 1234"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.numberPlate ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.numberPlate && <p className="text-red-500 text-[10px] font-medium">{errors.numberPlate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Payload Capacity (KG)</label>
                <input
                  type="number"
                  name="capacityKg"
                  value={formData.capacityKg}
                  placeholder="e.g. 1500"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.capacityKg ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.capacityKg && <p className="text-red-500 text-[10px] font-medium">{errors.capacityKg}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-2 border-b border-slate-50">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Service Coverage</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Service Areas</label>
                <input
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  placeholder="e.g. Kathmandu, Lalitpur, Bhaktapur"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.serviceAreas ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.serviceAreas && <p className="text-red-500 text-[10px] font-medium">{errors.serviceAreas}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Price per KM (NPR)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    placeholder="50"
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border ${errors.pricePerKm ? 'border-red-300' : 'border-slate-200'} rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium border-r pr-2 border-slate-200">Rs.</span>
                </div>
                {errors.pricePerKm && <p className="text-red-500 text-[10px] font-medium">{errors.pricePerKm}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || (user?.isVerified && user?.verificationStatus === "approved")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-12 py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : user?.isVerified && user?.verificationStatus === "approved" ? (
                "Already Verified"
              ) : user?.isKycDataSubmitted && user?.verificationStatus === "pending" ? (
                "KYC is Pending"
              ) : !user?.isKycDataSubmitted && user?.verificationStatus === "pending" ? (
                "KYC not Submitted"
              ) : user?.verificationStatus === "rejected" ? (
                "Reapply"
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransporterKycForm;
















 