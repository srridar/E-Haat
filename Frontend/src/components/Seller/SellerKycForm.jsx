import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
import {
  FileText, Landmark, FileCheck, Upload, X, CheckCircle2,
  ChevronLeft, Loader2, CreditCard, Info, Building2, AlertCircle
} from "lucide-react";
import { SELLER_API_END_POINT } from "@/utils/constants";

const SellerKycForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [sss, setSss] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchSellerStatus = async () => {
      try {
        const res = await axios.get(`${SELLER_API_END_POINT}/verification-status`, { withCredentials: true });
        if (res.data.success) {
          setSss(res.data.sss);
        }
      } catch (error) {
        console.error("Error fetching seller status:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    if (userId) fetchSellerStatus();
  }, [userId]);

  const [formData, setFormData] = useState({
    citizenshipCard: null,
    NationalIDCard: null,
    businessRegistration: null,
    PANcard: null,

    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    branchName: "",
    isRegisteredBusiness: "false",

    khaltiPhone: "",
    khaltiTransactionId: ""
  });

  const [previews, setPreviews] = useState({
    citizenshipCard: null,
    NationalIDCard: null,
    businessRegistration: null,
    PANcard: null
  });

  // Cleanup effect for URLs
  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        if (url && url !== "pdf-placeholder") URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      setPreviews((prev) => ({ ...prev, [fieldName]: "pdf-placeholder" }));
    }
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const removeFile = (fieldName) => {
    if (previews[fieldName] && previews[fieldName] !== "pdf-placeholder") {
      URL.revokeObjectURL(previews[fieldName]);
    }
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const required = ["accountHolderName", "bankName", "accountNumber", "branchName"];
    required.forEach(field => { if (!formData[field]) newErrors[field] = "Required"; });

    if (!formData.khaltiPhone) {
      newErrors.khaltiPhone = "Khalti phone is required";
    } else if (!/^(?:\+977|977)?(98|97)\d{8}$/.test(formData.khaltiPhone)) {
      newErrors.khaltiPhone = "Invalid Nepali phone number";
    }

    if (!formData.citizenshipCard) newErrors.citizenshipCard = "Required";
    if (!formData.NationalIDCard) newErrors.NationalIDCard = "Required";

    if (formData.isRegisteredBusiness === "true") {
      if (!formData.businessRegistration) newErrors.businessRegistration = "Required for businesses";
      if (!formData.PANcard) newErrors.PANcard = "Required for businesses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const res = await axios.post(`${SELLER_API_END_POINT}/submitkyc`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        window.location.reload(); // Refresh to catch new "Pending" status
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: error.response?.data?.message || "KYC submission failed." }));
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
        ${errors[name] ? 'border-red-300 bg-red-50' : previews[name] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}>
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
            <button type="button" onClick={() => removeFile(name)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600">
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <Upload size={24} className="text-slate-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-500 mt-2">Upload {label}</span>
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => changeFileHandler(e, name)} />
          </label>
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-[10px] font-medium">{errors[name]}</p>}
    </div>
  );

  // Status Conditional Rendering
  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (sss?.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg border border-green-200 p-8 text-center max-w-md">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">KYC Verified</h2>
          <p className="text-green-600 mb-6">Your KYC details have been successfully verified. You now have full access.</p>
          <button onClick={() => navigate("/seller/profile")} className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all active:scale-95">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (sss?.isKycDataSubmitted && sss?.verificationStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg border border-yellow-200 p-8 text-center max-w-md">
          <Info size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">KYC Under Review</h2>
          <p className="text-yellow-600 mb-6">Your details are currently being reviewed. We will notify you once complete.</p>
          <button onClick={() => navigate("/seller/profile")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-full transition-all active:scale-95">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // Final return: Show the form if not submitted, or if rejected
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-slate-900">Seller KYC</h1>
            <p className="text-slate-500 text-sm italic">Identity & Bank Verification</p>
          </div>
        </div>

        {sss?.verificationStatus === "rejected" && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-1" size={20} />
            <div>
              <h3 className="text-red-800 font-bold">Verification Rejected</h3>
              <p className="text-red-600 text-sm">Please review your documents and resubmit the form.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Building2 size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Business Type</h2>
            </div>
            <div className="flex gap-4">
              {["false", "true"].map((val) => (
                <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.isRegisteredBusiness === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                  <input type="radio" name="isRegisteredBusiness" value={val} checked={formData.isRegisteredBusiness === val} onChange={handleChange} className="hidden" />
                  {val === "true" ? "Registered Business" : "Individual Seller"}
                </label>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><CreditCard size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Identity Documents</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FileUploadField label="Citizenship Card" name="citizenshipCard" />
              <FileUploadField label="National ID Card" name="NationalIDCard" />
              {formData.isRegisteredBusiness === "true" && (
                <>
                  <FileUploadField label="Business Registration" name="businessRegistration" />
                  <FileUploadField label="PAN Card" name="PANcard" />
                </>
              )}
            </div>
          </div>


          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Landmark size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Khalti Payment Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Khalti Phone */}
              <div>
                <label className="text-xs font-bold text-slate-600 ml-1">
                  Khalti Phone
                </label>
                <input
                  name="khaltiPhone"
                  value={formData.khaltiPhone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  placeholder="98XXXXXXXX"
                />
                {errors.khaltiPhone && (
                  <p className="text-red-500 text-[10px]">{errors.khaltiPhone}</p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="text-xs font-bold text-slate-600 ml-1">
                  Transaction ID
                </label>
                <input
                  name="khaltiTransactionId"
                  value={formData.khaltiTransactionId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  placeholder="TXN123456"
                />
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-12 py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300">
              {loading ? <Loader2 className="animate-spin" /> : <FileCheck size={20} />}
              Resubmit KYC Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerKycForm;