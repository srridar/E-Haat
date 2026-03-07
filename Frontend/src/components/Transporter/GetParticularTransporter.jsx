import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Truck, CheckCircle, 
  XCircle, Star, Package, ArrowLeft, Loader2 
} from 'lucide-react';
import {ADMIN_API_END_POINT} from '@/utils/constants'

const GetParticularTransporter = () => {
  const role="transporter";
  const { id } = useParams();
  const navigate = useNavigate();
  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransporter = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ADMIN_API_END_POINT}/gettransporter/${id}`);
        if (response.data.success) {
          setTransporter(response.data.transporter);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch transporter details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransporter();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
        <p>Loading transporter profile...</p>
      </div>
    );
  }

  if (error || !transporter) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">{error || "Transporter not found"}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <button  onClick={() => navigate(-1)}  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img 
                  src={transporter?.profileImage?.url || `https://ui-avatars.com/api/?name=${transporter?.name || 'User'}&background=10b981&color=fff`} 
                  alt={transporter.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md"
                />
                {transporter.isVerified && (
                  <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                    <CheckCircle className="text-blue-600 w-6 h-6 fill-blue-50" />
                  </div>
                )}
              </div>
              
              <h1 className="mt-4 text-xl font-bold text-gray-800">{transporter.name}</h1>
              <div className="flex items-center gap-1 mt-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold">{transporter.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({transporter.totalDeliveries} Deliveries)</span>
              </div>

              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                transporter.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {transporter.isAvailable ? '● Available Now' : '● Currently Busy'}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-blue-500" />
                <span className="text-sm">{transporter.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-blue-500" />
                <span className="text-sm">{transporter.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-blue-500" />
                <span className="text-sm">{transporter.location?.address}</span>
              </div>
            </div>

            <button onClick={()=>navigate(`/product/hire-transporter/${id}`)} className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Hire Transporter
            </button>

             <button onClick={()=>navigate(`/message/chat/${role}/${id}`)} className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-blue-100">
              Contact Transporter
            </button>
          </div>
        </div>

       
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="text-blue-600" /> Vehicle Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Type</p>
                <p className="font-medium text-gray-800">{transporter.vehicle?.type || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Capacity</p>
                <p className="font-medium text-gray-800">{transporter.vehicle?.capacityKg || 0} KG</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Pricing</p>
                <p className="font-medium text-blue-600">Rs. {transporter.pricePerKm || 0} / KM</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Number Plate</p>
                <p className="font-medium text-gray-800 uppercase tracking-tighter">{transporter.vehicle?.numberPlate || '---'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" /> Service Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {transporter.serviceAreas?.length > 0 ? (
                transporter.serviceAreas.map((area, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
                    {area}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No specific areas listed.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-blue-600" /> Trust & Verification
            </h2>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              {transporter.isKycCompleted ? (
                <CheckCircle className="text-green-600 shrink-0" />
              ) : (
                <XCircle className="text-red-400 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {transporter.isKycCompleted ? 'KYC Verified' : 'KYC Pending'}
                </p>
                <p className="text-xs text-gray-500">
                  {transporter.isKycCompleted  ? 'This transporter has submitted all legal documents and is verified by our team.' : 'Transporter is currently being vetted by our administrators.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GetParticularTransporter;