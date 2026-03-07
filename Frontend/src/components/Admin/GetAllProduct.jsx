import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const GetAllProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `${ADMIN_API_END_POINT}/products`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // 📊 Summary counts
  const totalProducts = allProducts.length;
  const approved = allProducts.filter(p => p.isVerified).length;
  const pending = allProducts.filter(p => !p.isVerified && p.isActive).length;
  const rejected = allProducts.filter(p => !p.isActive).length;

  const getStatusBadge = (product) => {
    if (!product.isActive) {
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
          Rejected
        </span>
      );
    }
    if (product.isVerified) {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
          Approved
        </span>
      );
    }
    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
        Pending
      </span>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-12">

      {/* Back */}
      <div className="absolute top-3 left-4 bg-green-200 p-1 rounded hover:bg-green-300">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <p className="text-gray-500">Review, approve, and manage listed products</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Products" value={totalProducts} />
        <SummaryCard title="Approved" value={approved} color="text-green-600" />
        <SummaryCard title="Pending" value={pending} color="text-yellow-600" />
        <SummaryCard title="Rejected" value={rejected} color="text-red-600" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">Loading...</td>
              </tr>
            ) : allProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6">No products found</td>
              </tr>
            ) : (
              allProducts.map(product => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">
                    {product.seller?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">Rs. {product.price}</td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button className="text-blue-600 hover:underline">View</button>

                    {!product.isVerified && product.isActive && (
                      <>
                        <button className="text-green-600 hover:underline">
                          Approve
                        </button>
                        <button className="text-red-600 hover:underline">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 🔹 Reusable summary card */
const SummaryCard = ({ title, value, color = "text-gray-800" }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
  </div>
);

export default GetAllProduct;
