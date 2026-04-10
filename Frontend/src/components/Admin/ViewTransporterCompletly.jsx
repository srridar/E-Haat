import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Phone, Mail, FileText, Truck } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { ADMIN_API_END_POINT } from "@/utils/constants";
import useGetVerifyUser from "@/hooks/adminHooks/useGetVerifyUser";

const ViewTransporterCompletly = () => {
  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const verifyUser = useGetVerifyUser();

  const handleVerification = async (id, role, action) => {
    await verifyUser(id, role, action);
    setTransporter((prev) => ({
      ...prev,
      verificationStatus: action,
      isVerified: action === "approved" ? true : false,
    }));
  };

  const fetchTransporterDetails = async () => {
    try {
      const res = await axios.get(
        `${ADMIN_API_END_POINT}/transporter-approval/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTransporter(res.data.transporter);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporterDetails();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading transporter data...</div>;
  }

  if (!transporter) {
    return <div className="p-10 text-center">Transporter not found</div>;
  }

  return (
    <div className="relative max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className=" mb-8 flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center gap-6">

        <img src={transporter.profileImage?.url || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100" />

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {transporter.name}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-600">
            <span className="flex items-center gap-1">
              <Mail size={16} /> {transporter.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={16} /> {transporter.phone}
            </span>
          </div>

          <div className="mt-4 flex gap-2 justify-center md:justify-start">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${transporter.verificationStatus === "approved"
                ? "bg-green-100 text-green-700"
                : transporter.verificationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {transporter.verificationStatus?.toUpperCase() || "PENDING"}
            </span>

            {transporter.isKycCompleted && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                KYC Completed
              </span>
            )}
          </div>
        </div>

        {transporter.verificationStatus === "pending" && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleVerification(id, "transporter", "approved")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              <CheckCircle size={18} /> Approve Transporter
            </button>

            <button
              onClick={() => handleVerification(id, "transporter", "rejected")}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-lg border border-red-200 transition"
            >
              <XCircle size={18} /> Reject Application
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
              <Truck size={20} className="text-indigo-600" /> Vehicle Info
            </h3>

            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="text-gray-400 block text-xs uppercase">Type</span>
                {transporter.vehicle?.type || "N/A"}
              </li>
              <li>
                <span className="text-gray-400 block text-xs uppercase">Plate Number</span>
                {transporter.vehicle?.numberPlate || "N/A"}
              </li>
              <li>
                <span className="text-gray-400 block text-xs uppercase">Capacity</span>
                {transporter.vehicle?.capacityKg || "N/A"} kg
              </li>
              <li>
                <span className="text-gray-400 block text-xs uppercase">Rate</span>
                Rs. {transporter.pricePerKm || "N/A"}/km
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
              <MapPin size={20} className="text-indigo-600" /> Service Areas
            </h3>

            <div className="flex flex-wrap gap-2">
              {transporter.serviceAreas?.map((area, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
              <FileText size={20} className="text-indigo-600" /> Verification Documents
            </h3>

            {/* 🚗 Vehicle Photo */}
            <div className="mb-6 border rounded-lg p-4 bg-gray-50 hover:bg-white transition">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Vehicle Photo
              </p>

              {transporter?.vehicle?.vehiclePhoto ? (
                <div className="aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center relative group">
                  <img
                    src={transporter.vehicle.vehiclePhoto}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <a
                      href={transporter.vehicle.vehiclePhoto}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white text-xs underline"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 italic">
                  No vehicle photo uploaded
                </div>
              )}
            </div>

            {/* 📄 Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(transporter?.documents || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition"
                >
                  <p className="text-sm font-medium text-gray-500 capitalize mb-2">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>

                  {value ? (
                    <div className="aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center relative group">
                      <img
                        src={value}
                        alt={key}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white text-xs underline"
                        >
                          View Full Image
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 italic">
                      No document uploaded
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ViewTransporterCompletly;
