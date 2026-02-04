import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Store, CheckCircle } from "lucide-react";
import useGetAllSpecificUser from "@/hooks/sellerHooks/useGetAllSeller";

const GetAllVerifiedSellerProfile = () => {
  const getAllUsers = useGetAllSpecificUser();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      const data = await getAllUsers("seller");
      if (data) setSellers(data);
      setLoading(false);
    };

    fetchSellers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-orange-500">E-Haat Verified Sellers</h1>
        <p className="text-gray-600 mt-2">
          Trusted & verified sellers across Nepal
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 text-lg">Loading sellers...</div>
      )}

      {/* Empty State */}
      {!loading && sellers.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No verified sellers found
        </div>
      )}

      {/* Seller Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border"
          >
            {/* Profile Image */}
            <div className="h-40 bg-orange-100 flex items-center justify-center">
              <img
                src={seller.profileImage || "/avatar.png"}
                alt={seller.shopName}
                className="h-28 w-28 rounded-full object-cover border-4 border-white"
              />
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {seller.shopName || seller.name}
                </h2>
                <CheckCircle className="text-green-500" size={20} />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Store size={16} />
                  <span>{seller.category || "General Seller"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{seller.address || "Nepal"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{seller.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{seller.email}</span>
                </div>
              </div>

              {/* Action */}
              <button className="mt-4 w-full rounded-xl bg-orange-500 py-2 text-white font-medium hover:bg-orange-600 transition">
                View Products
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllVerifiedSellerProfile;